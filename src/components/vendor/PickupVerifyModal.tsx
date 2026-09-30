import React, { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, CameraOff, CheckCircle2, KeyRound, Loader2, ShoppingBag, User, AlertTriangle, PackageCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useMarketData } from '../../context/MarketDataContext';
import { VendorOrder } from '../../types/vendor';
import { errorMessage } from '../../services/api';
import { formatPrice } from '../../services/mappers';

/**
 * Pickup handover: the farmer scans the customer's QR code (or types the 6-digit code),
 * sees which order it belongs to, then confirms the handover. The backend refuses to complete
 * an order without the right code.
 * If `expectedOrder` is given (opened from an order's "Picked up" button) the code must belong to that order.
 */
export const PickupVerifyModal: React.FC<{ isOpen: boolean; onClose: () => void; expectedOrder?: VendorOrder | null }> = ({
  isOpen,
  onClose,
  expectedOrder,
}) => {
  const { verifyPickup, updateVendorOrderStatus } = useMarketData();

  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ msg: string; order: VendorOrder; code: string } | null>(null);

  // ---- camera scanning (jsQR works in every browser, including iPhone Safari) ----
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number>(0);
  const [scanning, setScanning] = useState(false);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  const verify = useCallback(
    async (input: string) => {
      setBusy(true);
      setError('');
      setResult(null);
      try {
        const res = await verifyPickup(input);
        if (expectedOrder && res.order.id !== expectedOrder.id) {
          setError(`This code belongs to order #${res.order.code}, not #${expectedOrder.code}.`);
        } else {
          setResult({ ...res, code: input });
        }
      } catch (err) {
        setError(errorMessage(err, 'Could not verify this code'));
      } finally {
        setBusy(false);
      }
    },
    [verifyPickup, expectedOrder]
  );

  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !streamRef.current) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qr = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
        if (qr?.data) {
          stopCamera();
          verify(qr.data);
          return;
        }
      }
    }
    frameRef.current = requestAnimationFrame(scanFrame);
  }, [stopCamera, verify]);

  const startCamera = async () => {
    setError('');
    setResult(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera is not available in this browser. Type the 6-digit code instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      setScanning(true);
      // the <video> element mounts once scanning is true
      requestAnimationFrame(async () => {
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
        frameRef.current = requestAnimationFrame(scanFrame);
      });
    } catch {
      setError('Camera permission was denied. Allow camera access, or type the 6-digit code instead.');
    }
  };

  // reset whenever the dialog opens / closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCode('');
      setError('');
      setResult(null);
    }
    return stopCamera;
  }, [isOpen, stopCamera]);

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.replace(/\D/g, '').length !== 6) {
      setError('The pickup code has 6 digits.');
      return;
    }
    stopCamera();
    verify(code);
  };

  const confirmHandover = async () => {
    if (!result) return;
    setBusy(true);
    const ok = await updateVendorOrderStatus(result.order.id, 'completed', undefined, result.code);
    setBusy(false);
    if (ok) onClose();
  };

  // order was scanned before it was packed: mark it ready, then look the code up again
  const markReadyThenRecheck = async () => {
    if (!result) return;
    setBusy(true);
    const ok = await updateVendorOrderStatus(result.order.id, 'ready_for_pickup');
    setBusy(false);
    if (ok) verify(result.code);
  };

  const order = result?.order;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expectedOrder ? `Verify pickup • #${expectedOrder.code}` : 'Scan pickup QR'}
      subtitle="Scan the customer's QR code or type the 6-digit code from their order."
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Camera */}
        {scanning ? (
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-h-72 mx-auto">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            <div className="pointer-events-none absolute inset-10 border-2 border-[#def54d] rounded-2xl" />
            <button
              type="button"
              onClick={stopCamera}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-xl font-bold text-slate-800 cursor-pointer"
            >
              <CameraOff className="w-3.5 h-3.5" /> Stop camera
            </button>
          </div>
        ) : (
          !order && (
            <button
              type="button"
              onClick={startCamera}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-xs transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" /> Scan QR with camera
            </button>
          )
        )}
        <canvas ref={canvasRef} className="hidden" />

        {/* Manual code */}
        {!order && (
          <form onSubmit={handleSubmitCode} className="flex items-center gap-2">
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^\d ]/g, '').slice(0, 7))}
                inputMode="numeric"
                autoComplete="off"
                placeholder="or type code, e.g. 482 913"
                className="w-full pl-9 pr-3 py-2.5 font-mono text-sm tracking-widest bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
            </button>
          </form>
        )}

        {error && (
          <p className="flex items-start gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </p>
        )}

        {/* Verified order */}
        {order && result && (
          <div className="space-y-3">
            <p
              className={`flex items-start gap-2 rounded-xl px-3 py-2 border ${
                order.status === 'ready_for_pickup' ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-amber-800 bg-amber-50 border-amber-200'
              }`}
            >
              {order.status === 'ready_for_pickup' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              {result.msg}
            </p>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded">#{order.code}</span>
                <span className="text-base font-extrabold text-slate-900">{formatPrice(order.totalAmount)}</span>
              </div>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> {order.customerName}
              </p>
              <p className="text-slate-500">
                {order.pickupSlot} • {order.marketName}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {order.items.map((it, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                    <ShoppingBag className="w-3 h-3 text-emerald-600" />
                    <strong>{it.name}</strong> ({it.quantity} {it.unit})
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setCode('');
                }}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
              >
                Scan another
              </button>
              {order.status === 'accepted' && (
                <button
                  type="button"
                  onClick={markReadyThenRecheck}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  <PackageCheck className="w-4 h-4" /> Mark ready now
                </button>
              )}
              {order.status === 'ready_for_pickup' && (
                <button
                  type="button"
                  onClick={confirmHandover}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  Handed over &amp; {formatPrice(order.totalAmount)} collected
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
