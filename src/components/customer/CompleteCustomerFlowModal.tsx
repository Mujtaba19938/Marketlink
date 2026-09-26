import React, { useState, useEffect } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';
import { ProductItem } from '../../types/market';
import { CustomerPreOrder, CustomerOrderStatus } from '../../types/customer';
import { ProduceArt } from '../ProduceArt';
import { API_CONFIG } from '../../config/api.config';
import { expressApiService } from '../../services/expressApiService';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Lock,
  Mail,
  Truck,
  MapPin,
  Clock,
  Phone,
  User,
  Key,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Send,
  Eye,
  EyeOff,
  Store,
} from 'lucide-react';

export interface FlowCartItem {
  product: ProductItem;
  quantity: number;
}

export type CustomerFlowStep =
  | 'cart' // Step 3: Cart Page
  | 'auth_check' // Step 4: Auth Check
  | 'register' // Step 5: Registration
  | 'email_verify' // Step 6: Email Verification
  | 'login' // Step 7: Login (Preserves Cart)
  | 'checkout' // Step 8: Checkout & Address
  | 'stripe_payment' // Step 9: Stripe Payment
  | 'order_confirmation' // Step 9 & 10: Confirmation & Tracking
  | 'delivery_tracking'; // Step 10: Live 6-Stage Delivery Tracking

interface CompleteCustomerFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: FlowCartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  initialStep?: CustomerFlowStep;
  onNavigateToDashboard?: () => void;
  selectedOrderForTracking?: CustomerPreOrder | null;
}

const STORAGE_PENDING_CHECKOUT_KEY = 'marketease_pending_checkout_state';

export const CompleteCustomerFlowModal: React.FC<CompleteCustomerFlowModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  initialStep = 'cart',
  onNavigateToDashboard,
  selectedOrderForTracking = null,
}) => {
  const { isAuthenticated, currentUser, login, registerCustomer } = useAuth();
  const { placeNewCustomerOrder, customerOrders, advanceOrderDeliveryStep, triggerToast } = useMarketData();

  // Current Step State
  const [currentStep, setCurrentStep] = useState<CustomerFlowStep>(
    selectedOrderForTracking ? 'delivery_tracking' : initialStep
  );

  // Delivery Choice
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');

  // Checkout Form Details
  const [checkoutForm, setCheckoutForm] = useState({
    name: currentUser?.name || 'Sarah Jenkins',
    email: currentUser?.email || 'sarah.jenkins@example.com',
    phone: currentUser?.phone || '+1 (555) 382-9104',
    address: currentUser?.address || '742 Evergreen Terrace, North Valley',
    area: 'North Valley',
    notes: 'Please leave at the front porch if unavailable.',
  });

  // Registration Form Details
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '450 Sunset Blvd, Sunset District',
    area: 'Sunset District',
  });
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Email Verification State
  const [generatedCode, setGeneratedCode] = useState<string>('849201');
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string>('');
  const [showSimulatedInbox, setShowSimulatedInbox] = useState<boolean>(true);
  const [resendCooldown, setResendCooldown] = useState<number>(30);

  // Login Form Details (Step 7)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('customer123');
  const [loginError, setLoginError] = useState('');

  // Stripe Payment Form Details (Step 9)
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardZip, setCardZip] = useState('94103');
  const [cardHolder, setCardHolder] = useState(checkoutForm.name || 'Sarah Jenkins');
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [stripeStatusMessage, setStripeStatusMessage] = useState('');

  // Active / Confirmed Order
  const [activeOrder, setActiveOrder] = useState<CustomerPreOrder | null>(
    selectedOrderForTracking || null
  );

  // Synchronize when selectedOrderForTracking changes
  useEffect(() => {
    if (selectedOrderForTracking) {
      setActiveOrder(selectedOrderForTracking);
      setCurrentStep('delivery_tracking');
    }
  }, [selectedOrderForTracking]);

  // Synchronize user info into checkout form when auth changes
  useEffect(() => {
    if (currentUser) {
      setCheckoutForm((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        address: currentUser.address || prev.address,
      }));
    }
  }, [currentUser]);

  // Handle countdown for resend code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 'email_verify' && resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [currentStep, resendCooldown]);

  if (!isOpen) return null;

  // Calculation
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryCharge = deliveryType === 'delivery' ? 3.5 : 0;
  const grandTotal = Number((subtotal + deliveryCharge).toFixed(2));

  // --- Step 4: Auth Check Logic ---
  const handleProceedFromCart = () => {
    if (cartItems.length === 0) {
      triggerToast('Your cart is empty. Please add fresh produce first.', 'warning');
      return;
    }

    // Preserve cart in sessionStorage
    try {
      sessionStorage.setItem(STORAGE_PENDING_CHECKOUT_KEY, JSON.stringify({ cartItems, checkoutForm }));
    } catch {
      // ignore
    }

    if (isAuthenticated) {
      // If customer is already logged in -> Go directly to Step 8 Checkout
      setCurrentStep('checkout');
    } else {
      // If NOT logged in -> Go to Step 4 Authentication Check
      setCurrentStep('auth_check');
    }
  };

  // --- Step 5: Registration Submit ---
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.password) {
      triggerToast('Please provide your name, email, and password', 'error');
      return;
    }

    // Call live backend registration & generate code
    let code = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const regRes = await expressApiService.registerCustomer({
        name: regForm.name,
        email: regForm.email,
        password: regForm.password,
        address: regForm.address,
        phone: regForm.phone,
      });
      if (regRes.verificationCodePreview) {
        code = regRes.verificationCodePreview;
      }
    } catch {
      // Local fallback
    }

    setGeneratedCode(code);
    setResendCooldown(30);
    setShowSimulatedInbox(true);
    setEnteredCode('');
    setVerificationError('');

    triggerToast(`Verification code sent to ${regForm.email}!`, 'info');
    setCurrentStep('email_verify');
  };

  // --- Step 6: Email Verification Validate ---
  const handleVerifyCode = async () => {
    if (enteredCode.trim() !== generatedCode.trim()) {
      setVerificationError('Invalid verification code. Please check your simulated inbox.');
      return;
    }

    // Verify code on Express backend
    try {
      await expressApiService.verifyEmail(regForm.email, enteredCode.trim());
    } catch {
      // Local fallback
    }

    setVerificationError('');
    triggerToast('Email verified successfully! Creating customer account...', 'success');

    // Register customer in local auth state
    await registerCustomer({
      name: regForm.name,
      email: regForm.email,
      contactNumber: regForm.phone || '+1 (555) 492-0192',
      address: regForm.address || '450 Sunset Blvd, Sunset District',
      password: regForm.password,
    });

    // CRITICAL REQUIREMENT:
    // User does NOT restart checkout! Return user immediately to Checkout page (Step 8)
    // with all existing cart items and pending details preserved!
    setCheckoutForm((prev) => ({
      ...prev,
      name: regForm.name,
      email: regForm.email,
      phone: regForm.phone || prev.phone,
      address: regForm.address || prev.address,
      area: regForm.area || prev.area,
    }));

    triggerToast('Authenticated! Returning to your pending checkout...', 'success');
    setCurrentStep('checkout');
  };

  // --- Step 7: Login & Return to Checkout ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const targetEmail = loginEmail.trim() || DEMO_CREDENTIALS.customer.email;
    const res = await login('customer', targetEmail, loginPassword);

    if (res.success) {
      triggerToast('Logged in successfully! Returning to your checkout...', 'success');
      // PRESERVE CART & pending checkout state -> Go directly to Step 8 Checkout!
      setCurrentStep('checkout');
    } else {
      setLoginError(res.message || 'Login failed. Please verify your credentials.');
    }
  };

  const handleQuickDemoLogin = async () => {
    await login('customer', DEMO_CREDENTIALS.customer.email, DEMO_CREDENTIALS.customer.password);
    triggerToast('Logged in as Clara Higgins! Returning to pending checkout...', 'success');
    setCurrentStep('checkout');
  };

  // --- Step 9: Real Stripe Payment Execution ---
  const [stripeCheckoutUrl, setStripeCheckoutUrl] = useState<string>('');

  const handleExecuteStripePayment = async () => {
    // 1. If not authenticated, prompt login and direct to login step
    if (!isAuthenticated) {
      triggerToast('Please log in to your customer account to complete Stripe checkout.', 'info');
      setCurrentStep('login');
      return;
    }

    setIsProcessingStripe(true);
    setCurrentStep('stripe_payment');
    setStripeStatusMessage('Contacting Stripe Payment Gateway & preparing checkout session...');

    try {
      const clientOrigin = window.location.origin;
      const apiOrder = await expressApiService.submitOrder({
        customer: {
          name: currentUser?.name || checkoutForm.name,
          email: currentUser?.email || checkoutForm.email,
          phone: checkoutForm.phone,
          address: checkoutForm.address,
        },
        items: cartItems.map((ci) => ({
          name: ci.product.name,
          buyPrice: ci.product.price,
          price: ci.product.price,
          qty: ci.quantity,
        })),
        total: grandTotal,
        paymentmethod: 'stripe',
        paymentMethod: 'stripe',
        deliveryType,
        deliveryAddress: checkoutForm.address,
        deliveryArea: checkoutForm.area,
        notes: checkoutForm.notes,
        clientOrigin,
      } as any);

      if (apiOrder?.url) {
        setStripeCheckoutUrl(apiOrder.url);
        setStripeStatusMessage('Redirecting to official Stripe Checkout page...');
        onClearCart();
        sessionStorage.removeItem(STORAGE_PENDING_CHECKOUT_KEY);
        // Direct redirection to Stripe's real hosted Checkout payment page
        window.location.href = apiOrder.url;
        return;
      }

      // If backend didn't return URL
      setIsProcessingStripe(false);
      triggerToast(apiOrder?.error || 'Could not initialize Stripe Checkout session.', 'error');
    } catch (err: any) {
      console.error('Stripe Checkout redirection error:', err);
      setIsProcessingStripe(false);
      triggerToast('Failed to reach payment gateway. Please try again.', 'error');
    }
  };


  // --- Step 10: Advance Delivery Step Simulation ---
  const handleAdvanceDelivery = () => {
    if (!activeOrder) return;
    advanceOrderDeliveryStep(activeOrder.id);
    const updated = customerOrders.find((o) => o.id === activeOrder.id);
    if (updated) {
      setActiveOrder(updated);
    } else {
      // Local fallback step increment
      const nextStep = Math.min(5, (activeOrder.deliveryStep ?? 1) + 1);
      const statuses: CustomerOrderStatus[] = [
        'placed',
        'payment_confirmed',
        'processing',
        'dispatched',
        'out_for_delivery',
        'delivered',
      ];
      setActiveOrder({
        ...activeOrder,
        deliveryStep: nextStep,
        status: statuses[nextStep],
      });
    }
  };

  // 6 Tracking Stages
  const trackingStages: { step: number; label: string; desc: string; icon: string }[] = [
    { step: 0, label: 'Order Placed', desc: 'Pre-order recorded in stall ledger', icon: '📝' },
    { step: 1, label: 'Payment Confirmed', desc: 'Stripe transaction verified & secured', icon: '💳' },
    { step: 2, label: 'Processing at Stall', desc: 'Farmer packing organic harvest', icon: '🥬' },
    { step: 3, label: 'Dispatched', desc: 'Transferred to refrigerated van', icon: '📦' },
    { step: 4, label: 'Out for Delivery', desc: 'Driver on local delivery route', icon: '🚚' },
    { step: 5, label: 'Delivered', desc: 'Package handed over safely', icon: '🏡' },
  ];

  const currentOrderStep = activeOrder?.deliveryStep ?? 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="theme-vezzole bg-[#0b1a13] text-white w-full max-w-2xl rounded-[32px] border border-emerald-900/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Progress & Navigation Header */}
        <div className="px-6 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-[#0e241b]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#def54d] text-[#0c1b14] flex items-center justify-center font-bold shadow-xs">
              {currentStep === 'cart' && <ShoppingBag className="w-5 h-5 stroke-[2.5]" />}
              {currentStep === 'auth_check' && <User className="w-5 h-5 stroke-[2.5]" />}
              {currentStep === 'register' && <User className="w-5 h-5 stroke-[2.5]" />}
              {currentStep === 'email_verify' && <Mail className="w-5 h-5 stroke-[2.5]" />}
              {currentStep === 'login' && <Key className="w-5 h-5 stroke-[2.5]" />}
              {currentStep === 'checkout' && <Truck className="w-5 h-5 stroke-[2.5]" />}
              {currentStep === 'stripe_payment' && <CreditCard className="w-5 h-5 stroke-[2.5]" />}
              {(currentStep === 'order_confirmation' || currentStep === 'delivery_tracking') && (
                <CheckCircle className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-['Outfit',sans-serif]">
                  {currentStep === 'cart' && 'Step 3: Review Cart & Summary'}
                  {currentStep === 'auth_check' && 'Step 4: Customer Account Check'}
                  {currentStep === 'register' && 'Step 5: Customer Registration'}
                  {currentStep === 'email_verify' && 'Step 6: Email Verification'}
                  {currentStep === 'login' && 'Step 7: Customer Sign In'}
                  {currentStep === 'checkout' && 'Step 8: Final Delivery Checkout'}
                  {currentStep === 'stripe_payment' && 'Step 9: Stripe Secure Payment'}
                  {currentStep === 'order_confirmation' && 'Step 9 & 10: Order Confirmed!'}
                  {currentStep === 'delivery_tracking' && 'Step 10: Real-Time Delivery Tracking'}
                </h3>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                {currentStep === 'cart' && 'Update quantities, choose delivery, or continue'}
                {currentStep === 'auth_check' && 'Verify account before proceeding to payment'}
                {currentStep === 'register' && 'Create your customer profile for express checkout'}
                {currentStep === 'email_verify' && 'Enter 6-digit security code sent to your inbox'}
                {currentStep === 'login' && 'Cart preserved! Sign in to immediately return to checkout'}
                {currentStep === 'checkout' && 'Review delivery address and final order breakdown'}
                {currentStep === 'stripe_payment' && 'Direct card authorization via Stripe gateway'}
                {currentStep === 'order_confirmation' && 'Payment successful • Order ID and charge generated'}
                {currentStep === 'delivery_tracking' && '6-stage live progress with real-time ETA'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Flow Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* ========================================================
              STEP 3: CART PAGE
             ======================================================== */}
          {currentStep === 'cart' && (
            <div className="space-y-5">
              {cartItems.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-base text-[var(--color-text-main)]">
                    Your produce cart is empty
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Browse this week&apos;s fresh farm harvest and add produce items directly to your cart.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl shadow-xs transition hover:opacity-90 cursor-pointer"
                  >
                    Start Browsing Harvest
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1 border-b border-[var(--color-border)]">
                      <span>Produce Item ({cartItems.length})</span>
                      <span>Subtotal</span>
                    </div>

                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3.5 bg-[var(--color-surface-muted)] rounded-2xl border border-[var(--color-border)] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-1 flex items-center justify-center shrink-0">
                            <ProduceArt type={item.product.imageType || 'cabbage'} className="w-9 h-9" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-[var(--color-text-main)]">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span>👨‍🌾 {item.product.farmerName || 'Marcus Vance'}</span>
                              <span>•</span>
                              <span className="font-bold text-[var(--color-primary)]">
                                ${item.product.price.toFixed(2)} / {item.product.unit || 'kg'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls & Total */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border)]">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right w-16">
                            <span className="font-black text-xs text-[var(--color-text-main)] tabular-nums">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Selection */}
                  <div className="p-4 bg-[var(--color-surface-muted)] rounded-2xl border border-[var(--color-border)] space-y-2">
                    <label className="text-xs font-bold text-slate-500 block">
                      Choose Fulfillment Method:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('delivery')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          deliveryType === 'delivery'
                            ? 'bg-[var(--color-surface)] border-[var(--color-primary)] shadow-xs'
                            : 'border-[var(--color-border)] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold flex items-center gap-1.5 text-[var(--color-text-main)]">
                            <Truck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                            <span>Eco Delivery</span>
                          </span>
                          <span className="text-xs font-bold text-[var(--color-primary)]">$3.50</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Direct to door in refrigerated van
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          deliveryType === 'pickup'
                            ? 'bg-[var(--color-surface)] border-[var(--color-primary)] shadow-xs'
                            : 'border-[var(--color-border)] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold flex items-center gap-1.5 text-[var(--color-text-main)]">
                            <Store className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                            <span>Stall Pickup</span>
                          </span>
                          <span className="text-xs font-bold text-emerald-500">FREE</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Collect at farmer stall counter
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Produce Subtotal:</span>
                      <span className="font-bold text-[var(--color-text-main)] tabular-nums">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Fulfillment &amp; Handling:</span>
                      <span className="font-bold text-[var(--color-text-main)] tabular-nums">
                        {deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-[var(--color-text-main)] pt-2 border-t border-[var(--color-border)]">
                      <span>Grand Total:</span>
                      <span className="text-lg font-black text-[var(--color-primary)] tabular-nums">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Proceed CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer"
                    >
                      Clear Entire Cart
                    </button>

                    <button
                      type="button"
                      onClick={handleProceedFromCart}
                      className="px-6 py-3 bg-[var(--color-primary)] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================
              STEP 4: AUTHENTICATION CHECK
             ======================================================== */}
          {currentStep === 'auth_check' && (
            <div className="space-y-6 py-2">
              <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Authentication Verification</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  To complete your harvest order and record your delivery details, please sign in or register
                  an account.
                </p>
                <div className="p-2.5 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-xs flex items-center justify-between font-semibold">
                  <span className="text-slate-400">Cart Preservation Status:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> {cartItems.length} items (${grandTotal}) saved
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: New Customer Registration */}
                <div className="p-5 bg-[var(--color-surface-muted)] rounded-2xl border border-[var(--color-border)] space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
                      New Customer
                    </span>
                    <h4 className="font-bold text-sm text-[var(--color-text-main)]">
                      Create Fresh Market Account
                    </h4>
                    <p className="text-xs text-slate-500">
                      Fast registration with instant email verification. Your cart will be ready for immediate checkout.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('register')}
                    className="w-full py-2.5 bg-[var(--color-primary)] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Register New Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Option 2: Existing Customer Login */}
                <div className="p-5 bg-[var(--color-surface-muted)] rounded-2xl border border-[var(--color-border)] space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                      Returning Customer
                    </span>
                    <h4 className="font-bold text-sm text-[var(--color-text-main)]">
                      Sign In to Existing Account
                    </h4>
                    <p className="text-xs text-slate-500">
                      Sign in with your email &amp; password. You will be redirected right back to this checkout!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('login')}
                    className="w-full py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-[var(--color-text-main)]"
                  >
                    <Key className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sign In With Email</span>
                  </button>
                </div>
              </div>

              {/* Quick 1-Click Demo Shortcut */}
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                    ⚡ Instant Demo Customer Access
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Sign in automatically as Clara Higgins ({DEMO_CREDENTIALS.customer.email})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                >
                  Quick Demo Login →
                </button>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep('cart')}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
              </button>
            </div>
          )}

          {/* ========================================================
              STEP 5: REGISTRATION FORM
             ======================================================== */}
          {currentStep === 'register' && (
            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
                ℹ️ We will send a 6-digit confirmation code to your email to verify your customer account.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="e.g. maya@example.com"
                    className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="At least 6 characters"
                      className="w-full pl-3 pr-9 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={regForm.address}
                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                    placeholder="Street, Apartment or Suite"
                    className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('auth_check')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <span>Register &amp; Send Verification Code</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              STEP 6: EMAIL VERIFICATION (OTP CODE & SIMULATED INBOX)
             ======================================================== */}
          {currentStep === 'email_verify' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[var(--color-text-main)]">
                  Verify Your Email Address
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We sent a 6-digit verification code to{' '}
                  <span className="font-bold text-[var(--color-text-main)]">
                    {regForm.email || 'your email'}
                  </span>
                  . Enter the code below to verify your account.
                </p>
              </div>

              {/* Simulated Email Preview Box */}
              {showSimulatedInbox && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2 shadow-lg animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> Incoming Simulated Email
                    </span>
                    <span>To: {regForm.email || 'customer@example.com'}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-bold text-white">Subject: Verify your MarketEase customer account</div>
                    <p className="text-slate-300 text-[11px]">
                      Welcome to MarketEase! Your single-use email verification code is:
                    </p>
                    <div className="py-2 text-center">
                      <span className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-lg tracking-widest">
                        {generatedCode}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-slate-800">
                    <span className="text-[10px] text-slate-500">Security: Expires in 15 minutes</span>
                    <button
                      type="button"
                      onClick={() => setEnteredCode(generatedCode)}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                    >
                      Autofill Code ({generatedCode})
                    </button>
                  </div>
                </div>
              )}

              {/* Code Input */}
              <div className="max-w-xs mx-auto space-y-2 text-center">
                <input
                  type="text"
                  maxLength={6}
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  className="w-full text-center text-2xl font-mono font-bold tracking-widest px-4 py-3 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-2xl text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />

                {verificationError && (
                  <p className="text-xs text-rose-500 font-semibold">{verificationError}</p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Didn&apos;t receive it?</span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0}
                    onClick={() => {
                      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                      setGeneratedCode(newCode);
                      setResendCooldown(30);
                      triggerToast('New verification code generated and sent!', 'info');
                    }}
                    className="text-[var(--color-primary)] font-bold hover:underline disabled:opacity-40 cursor-pointer"
                  >
                    Resend Code {resendCooldown > 0 && `(${resendCooldown}s)`}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('register')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Form
                </button>

                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verify &amp; Return to Checkout</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 7: LOGIN (PRESERVES CART & PENDING CHECKOUT STATE)
             ======================================================== */}
          {currentStep === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  <strong>Cart preserved!</strong> Sign in and you will return directly to your pending checkout
                  without restarting.
                </span>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-xs text-rose-600 font-semibold">
                  {loginError}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="clara.higgins@gmail.com"
                    className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Quick Auto-fill buttons */}
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail(DEMO_CREDENTIALS.customer.email);
                    setLoginPassword(DEMO_CREDENTIALS.customer.password);
                  }}
                  className="text-[var(--color-primary)] font-bold hover:underline cursor-pointer"
                >
                  Fill Demo Credentials (Clara Higgins)
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('auth_check')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <span>Sign In &amp; Return to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              STEP 8: CHECKOUT PAGE
             ======================================================== */}
          {currentStep === 'checkout' && (
            <div className="space-y-5">
              {/* Authenticated Customer Banner */}
              <div className="p-3 bg-[var(--color-surface-muted)] rounded-2xl border border-[var(--color-border)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs">
                    {checkoutForm.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-[var(--color-text-main)] block">
                      {checkoutForm.name}
                    </span>
                    <span className="text-[11px] text-slate-400">{checkoutForm.email}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20">
                  Verified Customer
                </span>
              </div>

              {/* Delivery Address & Region */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Delivery Destination &amp; Area
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                      placeholder="Street, suite, or buzzer"
                      className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Region / Area
                    </label>
                    <select
                      value={checkoutForm.area}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, area: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                    >
                      <option value="Downtown Metro">Downtown Metro</option>
                      <option value="Sunset District">Sunset District</option>
                      <option value="Bayview Coast">Bayview Coast</option>
                      <option value="North Valley">North Valley</option>
                      <option value="Oakwood Hills">Oakwood Hills</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Delivery Note
                    </label>
                    <input
                      type="text"
                      value={checkoutForm.notes}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                      placeholder="e.g. Leave with doorman"
                      className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-[var(--color-surface-muted)] rounded-2xl border border-[var(--color-border)] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-main)]">
                  <span>Order Items ({cartItems.length})</span>
                  <span>Total</span>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-2 pr-1 text-xs">
                  {cartItems.map((it) => (
                    <div key={it.product.id} className="flex justify-between items-center text-slate-500">
                      <span>
                        {it.product.name} × {it.quantity} {it.product.unit || 'kg'}
                      </span>
                      <span className="font-bold text-[var(--color-text-main)] tabular-nums">
                        ${(it.product.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[var(--color-border)] space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-bold tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Fee ({deliveryType}):</span>
                    <span className="font-bold tabular-nums">
                      {deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[var(--color-text-main)] pt-1 border-t border-[var(--color-border)]">
                    <span>Grand Total:</span>
                    <span className="text-lg font-black text-[var(--color-primary)] tabular-nums">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation CTA */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('cart')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      triggerToast('Please log in to your customer account to complete Stripe checkout.', 'info');
                      setCurrentStep('login');
                      return;
                    }
                    handleExecuteStripePayment();
                  }}
                  className="px-6 py-3 bg-[var(--color-primary)] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Stripe Payment (${grandTotal.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 9: OFFICIAL STRIPE PAYMENT REDIRECTION
             ======================================================== */}
          {currentStep === 'stripe_payment' && (
            <div className="space-y-6 py-6 text-center">
              {/* Stripe Trust Header */}
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-3 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-wider border border-indigo-500/20">
                  Stripe Hosted Checkout
                </span>
                <h3 className="text-lg font-extrabold text-[var(--color-text-main)]">
                  Official Stripe Payment Gateway
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {stripeStatusMessage || 'Connecting to Stripe 256-bit encrypted checkout...'}
                </p>
              </div>

              {/* Order Summary Card */}
              <div className="p-4 bg-[var(--color-surface-muted)] rounded-2xl border border-[var(--color-border)] max-w-sm mx-auto space-y-2 text-left">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Customer:</span>
                  <span className="font-semibold text-[var(--color-text-main)]">{currentUser?.name || checkoutForm.name}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Items:</span>
                  <span className="font-semibold text-[var(--color-text-main)]">{cartItems.length} items</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Delivery to:</span>
                  <span className="font-semibold text-[var(--color-text-main)] truncate max-w-[180px]">{checkoutForm.address}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[var(--color-text-main)] pt-2 border-t border-[var(--color-border)]">
                  <span>Grand Total:</span>
                  <span className="text-emerald-500 font-mono text-base">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Loading Spinner & Actions */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isProcessingStripe ? 'Opening Stripe Checkout Session...' : 'Ready for Stripe'}</span>
                </div>

                {stripeCheckoutUrl ? (
                  <a
                    href={stripeCheckoutUrl}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md"
                  >
                    Click here to open Stripe Checkout
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleExecuteStripePayment}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    Launch Stripe Payment Now
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsProcessingStripe(false);
                    setCurrentStep('checkout');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer pt-2"
                >
                  ← Back to Checkout
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 9 & 10: ORDER CONFIRMATION
             ======================================================== */}
          {currentStep === 'order_confirmation' && activeOrder && (
            <div className="text-center space-y-4 py-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                  Order Reference: #{activeOrder.id}
                </span>
                <h4 className="text-xl font-bold text-[var(--color-text-main)]">
                  Stripe Payment Confirmed &amp; Order Placed! 🎉
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your harvest order has been received by the farmer and verified by Stripe. Real-time delivery
                  tracking is now operational.
                </p>
              </div>

              <div className="bg-[var(--color-surface-muted)] p-4 rounded-2xl border border-[var(--color-border)] text-xs text-left max-w-md mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-mono font-bold text-[var(--color-text-main)]">
                    #{activeOrder.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stripe Transaction:</span>
                  <span className="font-mono text-[11px] text-indigo-500 font-semibold truncate max-w-[200px]">
                    {activeOrder.stripeChargeId || 'ch_test_authorized'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Address:</span>
                  <span className="font-bold text-[var(--color-text-main)]">
                    {activeOrder.deliveryAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Arrival:</span>
                  <span className="font-bold text-emerald-500">
                    {activeOrder.deliveryEstimatedTime || '35 - 45 mins'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[var(--color-border)] pt-2 font-bold">
                  <span className="text-slate-500">Total Paid via Stripe:</span>
                  <span className="font-mono text-base text-[var(--color-primary)]">
                    ${activeOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('delivery_tracking')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition"
                >
                  <Truck className="w-4 h-4" />
                  <span>Launch Live Delivery Tracker →</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 10: 6-STAGE DELIVERY TRACKING
             ======================================================== */}
          {currentStep === 'delivery_tracking' && activeOrder && (
            <div className="space-y-6">
              {/* Tracker Header */}
              <div className="p-4 bg-[var(--color-surface-muted)] rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[var(--color-primary)]">
                      Order #{activeOrder.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold capitalize">
                      {activeOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Courier: {activeOrder.courierName || 'Alex Morales (Eco-Van)'} •{' '}
                    {activeOrder.courierPhone || '+1 (555) 438-9210'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Estimated Arrival</span>
                  <span className="text-xs font-black text-emerald-500 font-mono">
                    {activeOrder.deliveryEstimatedTime || '30 - 45 mins'}
                  </span>
                </div>
              </div>

              {/* Interactive 6-Stage Progress Stepper */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                  <span>Delivery Journey (6 Stages)</span>
                  <span className="text-emerald-500 font-bold">
                    Stage {currentOrderStep + 1} of 6
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                    style={{ width: `${((currentOrderStep + 1) / 6) * 100}%` }}
                  />
                </div>

                {/* Step List */}
                <div className="space-y-3 pt-2">
                  {trackingStages.map((stage) => {
                    const isPassed = currentOrderStep > stage.step;
                    const isCurrent = currentOrderStep === stage.step;
                    const isUpcoming = currentOrderStep < stage.step;

                    return (
                      <div
                        key={stage.step}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-[var(--color-surface)] border-[var(--color-primary)] shadow-sm'
                            : isPassed
                            ? 'bg-[var(--color-surface-muted)] border-[var(--color-border)] opacity-80'
                            : 'bg-transparent border-transparent opacity-40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCurrent
                                ? 'bg-[var(--color-primary)] text-white shadow-xs animate-pulse'
                                : isPassed
                                ? 'bg-emerald-500/20 text-emerald-600'
                                : 'bg-slate-200 dark:bg-white/10 text-slate-400'
                            }`}
                          >
                            {isPassed ? <CheckCircle className="w-4 h-4" /> : stage.icon}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h5
                                className={`text-xs font-bold ${
                                  isCurrent
                                    ? 'text-[var(--color-primary)]'
                                    : 'text-[var(--color-text-main)]'
                                }`}
                              >
                                {stage.label}
                              </h5>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[9px] font-black uppercase tracking-wider">
                                  Current Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">{stage.desc}</p>
                          </div>
                        </div>

                        <div className="text-right text-[10px] text-slate-400 font-mono">
                          {isPassed && 'Completed'}
                          {isCurrent && 'In Progress'}
                          {isUpcoming && 'Pending'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulation Stepper Button (For interactive testing & demonstration) */}
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                    🧪 Interactive Delivery Step Simulation
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Advance order through the 6 stages in real-time
                  </span>
                </div>

                <button
                  type="button"
                  disabled={currentOrderStep >= 5}
                  onClick={handleAdvanceDelivery}
                  className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-95 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer shrink-0"
                >
                  {currentOrderStep >= 5 ? 'Order Fully Delivered!' : 'Advance Next Stage →'}
                </button>
              </div>

              {/* Final Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Close Window
                </button>

                {onNavigateToDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToDashboard();
                    }}
                    className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow-xs transition hover:opacity-90 cursor-pointer"
                  >
                    View All Orders in Dashboard →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
