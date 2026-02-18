'use client';

import { CartPhoneInput } from '@/components/ui';

import { cn } from '@/utils';

import { CartContactFormProps } from './types';

export const CartContactForm: React.FC<CartContactFormProps> = ({
  checkoutState,
  setCheckoutState,
  className = '',
  handleValidationPhone,
  handleValidationName,
  errors,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCheckoutState(prev => ({ ...prev, [name]: value }));

    if (name === 'name') {
      handleValidationName(value);
    }
  };

  return (
    <div className={cn('rounded-lg bg-white p-4', className)}>
      <h2 className="text-lg font-semibold text-darkBlueText">
        Контактна інформація
      </h2>
      <div className="flex flex-col gap-1">
        <label className="relative block pb-5 text-sm font-medium text-gray-700">
          Імя <span className="text-red">*</span>
          <input
            id="name"
            name="name"
            type="text"
            value={checkoutState.name}
            onChange={handleChange}
            onBlur={e => handleValidationName(e.target.value)}
            required
            className={cn(
              'mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
              { 'border-red bg-rose-100': errors.name },
            )}
          />
          {errors.name && (
            <p className="absolute bottom-0 text-[12px] text-red">
              {'Імʼя повинно містити від 2 до 64 символів'}
            </p>
          )}
        </label>

        <div>
          <CartPhoneInput
            value={checkoutState.phone}
            onChange={handleChange}
            handleValidationPhone={handleValidationPhone}
            errors={errors}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Електронна пошта
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={checkoutState.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Коментар
          </label>
          <textarea
            id="comment"
            name="comment"
            value={checkoutState.comment}
            onChange={handleChange}
            className="mt-1 block w-full resize-none rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
