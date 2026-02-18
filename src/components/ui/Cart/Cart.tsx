'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  CartBtns,
  CartCheckoutSummary,
  CartContactForm,
  CartDeliveryForm,
  CartEmptyNotice,
  CartErrorAlert,
  CartPaymentForm,
  CartProducts,
  CartSummary,
  Loader,
  Modal,
  RecaptchaRef,
} from '@/components/ui';

import { useCart } from '@/context';
import { addOrder } from '@/actions/servicesAPI';

const DEFAULT_STATE = {
  name: '',
  phone: '',
  email: '',
  comment: '',
  city: '',
  postOffice: '',
  deliveryMethod: 'post' as DeliveryMethod,
  paymentMethod: 'prepayment' as PaymentMethod,
};

const CHECKOUT_STORAGE_KEY = 'CHECKOUT_STATE';

const Cart: React.FC<CartProps> = ({ isPage, isCheckoutPage }) => {
  const {
    items,
    syncCart,
    clearCart,
    totalAmount,
    totalAmountWithDiscount,
    totalDiscount,
  } = useCart();

  const router = useRouter();

  const [pending, setPending] = useState(false);

  const [isCartLoading, setIsCartLoading] = useState(true);

  const [errors, setErrors] = useState<CartErrors>({});

  const [submitError, setSubmitError] = useState<boolean>(false);
  const [isCaptchaError, setIsCaptchaError] = useState<boolean>(false);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  const [checkoutState, setCheckoutState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_STATE;
    }
    return DEFAULT_STATE;
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaRef>(null);

  const {
    name,
    phone,
    email,
    comment,
    city,
    postOffice,
    deliveryMethod,
    paymentMethod,
  } = checkoutState;

  useEffect(() => {
    localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutState));
  }, [checkoutState]);

  useEffect(() => {
    const updCart = async () => {
      await syncCart();
      setIsCartLoading(false);
    };

    updCart();
  }, [syncCart]);

  if (isCartLoading) {
    return <Loader />;
  }

  if (items.length === 0) {
    return <CartEmptyNotice />;
  }

  const hasUnavailableItem = items.some(
    item => item.availability === '0' && item.availabilityLviv === '0',
  );

  const isOrderAmountValid = totalAmount >= 500;

  const hasContactsData = [name, phone, email, comment].some(
    value => value?.trim() !== '',
  );

  const handleValidationName = (val: string) => {
    const nameCleaned = val?.trim();

    if (nameCleaned.length < 2 || nameCleaned.length > 64) {
      setErrors(pS => ({ ...pS, name: 'name' }));
    } else {
      setErrors(pS => ({ ...pS, name: undefined }));
    }
  };

  const handleValidationPhone = (val: string) => {
    const phoneCleaned = val.replace(/\D/g, '');

    if (phoneCleaned.length < 12) {
      setErrors(pS => ({ ...pS, phone: 'phone' }));
    } else {
      setErrors(pS => ({ ...pS, phone: undefined }));
    }
  };

  const handleSubmitValidateName = (val: string): string | undefined => {
    const nameCleaned = val?.trim();
    if (nameCleaned.length < 2) {
      return 'name';
    }
  };

  const handleSubmitValidatePhone = (val: string): string | undefined => {
    const phoneCleaned = val.replace(/\D/g, '');
    if (phoneCleaned.length < 12) {
      return 'phone';
    }
  };

  const handleCloseErrorAlert = () => {
    setIsCaptchaError(false);
    setSubmitError(false);
  };

  const handleSubmitCart = async () => {
    if (!captchaToken) {
      setRecaptchaError('Будь ласка, підтвердьте, що Ви не робот.');

      return;
    }

    setRecaptchaError(null);

    const data = {
      name,
      phone,
      email,
      message: comment,
      delivery: deliveryMethod,
      deliveryCity: city,
      postOffice: postOffice,
      payment: paymentMethod,
      products: items,
      captchaToken,
      totalAmount,
      totalAmountWithDiscount,
      totalDiscount,
    };

    const nameError = handleSubmitValidateName(name);
    const phoneError = handleSubmitValidatePhone(phone);

    const newErrors: CartErrors = {
      name: nameError,
      phone: phoneError,
    };

    setErrors(newErrors);

    if (nameError || phoneError) {
      console.log('error');
      return;
    }

    setPending(true);

    try {
      const result = await addOrder(data);

      clearCart();
      localStorage.removeItem(CHECKOUT_STORAGE_KEY);
      setCheckoutState(DEFAULT_STATE);

      router.push(`/checkout/result?data=${JSON.stringify(result.data)}`);
      setPending(false);

      recaptchaRef.current?.reset();
      setCaptchaToken(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setPending(false);

      const msg = e.message;

      //Сообщение если и коректировать то здесь и мидлваре "recaptcha" на сервере
      if (msg === 'Captcha verification failed') {
        setIsCaptchaError(true);
      }
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setSubmitError(true);
    }
  };

  // Когда корзина сможет рендерится на сервере добавить сируктурные данные JSON-LD

  return (
    <>
      <div className="flex flex-col">
        {isCheckoutPage ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:gap-6">
              <CartContactForm
                checkoutState={checkoutState}
                setCheckoutState={setCheckoutState}
                handleValidationPhone={handleValidationPhone}
                handleValidationName={handleValidationName}
                errors={errors}
                className="rounded-[16px] shadow-customLight xl:w-[434px]"
              />
              <CartDeliveryForm
                checkoutState={checkoutState}
                setCheckoutState={setCheckoutState}
                className="rounded-[16px] shadow-customLight xl:w-[434px]"
              />
              <CartPaymentForm
                checkoutState={checkoutState}
                setCheckoutState={setCheckoutState}
                className="rounded-[16px] shadow-customLight xl:w-[434px]"
              />
            </div>
            <div className="relative gap-6 xl:flex">
              <div className="mb-4 flex grow flex-col gap-6 xl:mb-0">
                <CartProducts items={items} isCheckoutPage />
              </div>

              <CartCheckoutSummary
                hasContactsData={hasContactsData}
                checkoutState={checkoutState}
                hasUnavailableItem={hasUnavailableItem}
                handleSubmitCart={handleSubmitCart}
                setCaptchaToken={setCaptchaToken}
                recaptchaRef={recaptchaRef}
                errors={errors}
                recaptchaError={recaptchaError}
                setRecaptchaError={setRecaptchaError}
                isOrderAmountValid={isOrderAmountValid}
              />
            </div>

            <Modal show={submitError} onClose={handleCloseErrorAlert}>
              <CartErrorAlert isCaptchaError={isCaptchaError} />
            </Modal>
            {pending && <Loader />}
          </div>
        ) : (
          <>
            <CartProducts
              items={items}
              className="flex h-[50vh] flex-col gap-4 overflow-hidden overflow-y-auto p-4 xl:h-[40vh]"
            />

            <CartSummary className="pt-2 shadow-customTop md:pt-8" />

            <CartBtns hasUnavailableItem={hasUnavailableItem} isPage={isPage} />
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
