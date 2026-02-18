'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

import { FaTelegram } from 'react-icons/fa6';
import { IoIosCall, IoMdArrowDropdown } from 'react-icons/io';

import { CartPhoneInput, Recaptcha, RecaptchaRef } from '@/components/ui';
import staticData from '@/data/common.json';
import { addCallback } from '@/actions/servicesAPI';
import { cn } from '@/utils';

interface AssistanceProps {
  /**
   * 'default' - поведение попапа (для хедера/десктопа)
   * 'mobile' - блочное поведение с аккордеоном (для мобильного меню)
   */
  variant?: 'default' | 'mobile';
  className?: string;
}

export const Assistance: React.FC<AssistanceProps> = ({
  variant = 'default',
  className,
}) => {
  const { telegram } = staticData.contacts;
  const { label, textTG, textReCall } = staticData.assistance;

  // --- Common State ---
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ phone?: string }>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Variant Specific State ---
  // 'isOpen' используется для видимости самого Попапа (только Desktop)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // 'showForm' используется для переключения между кнопкой "Дзвінок" и самой Формой
  const [showForm, setShowForm] = useState(false);

  const recaptchaRef = useRef<RecaptchaRef>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // --- Logic ---

  const resetForm = () => {
    setPhone('');
    setErrors({});
    setCaptchaToken(null);
    setRecaptchaError(null);
    recaptchaRef.current?.reset();
  };

  const closeAll = () => {
    setIsPopoverOpen(false);
    setShowForm(false);
    resetForm();
    if (variant === 'default') {
      buttonRef.current?.focus();
    }
  };

  const validatePhone = (value: string): boolean => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 12) {
      setErrors({
        phone:
          variant === 'mobile'
            ? 'Некоректний номер'
            : 'Некоректний номер телефону',
      });
      return false;
    }
    setErrors({});
    return true;
  };

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    if (errors.phone) validatePhone(e.target.value);
  };

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (recaptchaError) setRecaptchaError(null);
  };

  const onSubmit = async () => {
    if (!validatePhone(phone)) {
      toast.error('Некоректний номер телефону');
      return;
    }
    if (!captchaToken) {
      setRecaptchaError(
        variant === 'mobile'
          ? 'Підтвердьте, що Ви не робот'
          : 'Будь ласка, підтвердьте, що Ви не робот.',
      );
      return;
    }
    setRecaptchaError(null);
    setLoading(true);

    try {
      const res = await addCallback({ phone, captchaToken });
      if (res.code !== 201) throw new Error('Помилка сервера');

      toast.success('Дякуємо! Очікуйте дзвінка');
      closeAll();
    } catch {
      toast.error('Сталася помилка. Спробуйте пізніше');
    } finally {
      setLoading(false);
    }
  };

  // --- Desktop Specific Effects ---
  useEffect(() => {
    if (variant !== 'default') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeAll();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAll();
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopoverOpen, variant]);

  // --- Render Helpers ---

  // Рендерит внутренности формы (инпут, капча, кнопка сабмита)
  // Принимает стили кнопки submit, так как они отличаются в дизайнах
  const renderFormContent = (
    submitBtnClass: string,
    submitBtnText: React.ReactNode,
  ) => (
    <>
      <CartPhoneInput
        value={phone}
        onChange={onPhoneChange}
        handleValidationPhone={validatePhone}
        errors={errors}
        showLabel={false}
      />

      <div
        className={cn(
          'flex w-full flex-col items-center justify-center',
          variant === 'mobile' && 'overflow-hidden rounded-lg',
        )}
      >
        {/* Scale капчи для мобильных экранов (как было в MobileAssistance) */}
        <div
          className={cn(
            variant === 'mobile' && 'origin-center scale-[0.85] sm:scale-100',
          )}
        >
          <Recaptcha
            ref={recaptchaRef}
            formId={`vin-${variant}`} // Уникальный ID для разных вариантов
            siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={onCaptchaChange}
            size="compact"
          />
        </div>
        {recaptchaError && (
          <p
            className={cn(
              'mt-2 text-sm text-red',
              variant === 'mobile' && 'text-center text-xs',
            )}
          >
            {recaptchaError}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className={submitBtnClass}
      >
        {loading ? 'Відправка...' : submitBtnText}
      </button>
    </>
  );

  // --- MOBILE LAYOUT ---
  if (variant === 'mobile') {
    return (
      <div className={cn('flex w-full flex-col gap-3', className)}>
        <div className="flex w-full gap-3">
          <Link
            href={`https://t.me/${telegram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex size-12 flex-none items-center justify-center rounded-xl border border-[#229ED9]/20 bg-[#229ED9]/10 text-[#229ED9] transition-all hover:bg-[#229ED9] hover:text-white active:scale-95"
          >
            <FaTelegram size={22} />
          </Link>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className={cn(
              'flex h-12 flex-1 items-center justify-between gap-2 rounded-xl border px-4 transition-all active:scale-95',
              showForm
                ? 'border-white bg-white text-darkBg'
                : 'border-white/30 bg-transparent text-white hover:border-white',
            )}
          >
            <IoIosCall size={22} className="shrink-0" />

            <span className="text-center text-sm font-medium leading-tight">
              Зворотній дзвінок
            </span>

            <IoMdArrowDropdown
              size={20}
              className={cn(
                'shrink-0 transition-transform duration-300',
                showForm && 'rotate-180',
              )}
            />
          </button>
        </div>

        {/* Выезжающая форма */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="mt-1 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-center text-sm text-gray-400">
                  Залиште номер, ми перетелефонуємо
                </p>

                {renderFormContent(
                  // Классы кнопки для мобилки
                  'flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-bold text-darkBg transition-transform active:scale-95 disabled:opacity-70',
                  'Чекаю дзвінка',
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- DEFAULT (DESKTOP POPOVER) LAYOUT ---
  return (
    <div className={cn('relative inline-block w-full text-center', className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setIsPopoverOpen(prev => !prev);
          setShowForm(false); // Сброс стейта вложенной формы при переключении попапа
        }}
        className="rounded-[4px] px-4 py-2 text-white transition-all hover:bg-mediumBg/20 focus:bg-mediumBg/20 focus:outline-none focus-visible:ring"
        aria-haspopup="dialog"
        aria-expanded={isPopoverOpen}
      >
        {label}
      </button>

      {isPopoverOpen && (
        <div
          ref={panelRef}
          id="assistance-popover"
          role="dialog"
          aria-modal="true"
          className="absolute z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-darkBg p-6 text-primaryText shadow-xl"
          style={{ right: 0 }}
        >
          <div className="flex flex-col gap-4 text-sm">
            <Link
              href={`https://t.me/${telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#229ED9] px-4 py-2 text-center text-white transition-colors hover:bg-[#1e8dbf]"
            >
              {textTG}
              <FaTelegram size={20} />
            </Link>

            {!showForm ? (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 focus:bg-gray-600"
              >
                {textReCall} <IoIosCall size={20} />
              </button>
            ) : (
              renderFormContent(
                // Классы кнопки для десктопа
                'flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-70',
                <>
                  Відправити номер <IoIosCall size={20} />
                </>,
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
