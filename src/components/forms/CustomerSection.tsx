import { useFormContext } from 'react-hook-form';
import {
  MapPin,
  Store,
  ChevronDown,
  Bike,
  ShoppingBag,
} from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { cn, formatPHMobile, formatTimeSlot } from '@/lib/utils';
import type { OrderSchema } from '@/lib/schemas';
import { useSearchParams } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import { customersApi, typesApi,  } from '@/lib/api';
import { useEffect } from 'react';
import { TypeOption } from '@/types';

// ── PH Barangay data (replace with your full dataset or API call) ─────────────
const SAMPLE_BARANGAYS = [
  'Barangay 1',
  'Barangay 2',
  'Barangay 3',
  'Barangay 4',
  'Barangay 5',
  'Poblacion',
  'Bagong Silang',
  'Batasan Hills',
  'Commonwealth',
  'Fairview',
  'Holy Spirit',
  'Payatas',
  'Sauyo',
];

// ── Section divider ───────────────────────────────────────────────────────────
function SectionDivider({
  icon,
  title,
}: {
  icon?: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border-y border-slate-200">
      <span className="text-slate-500">{icon}</span>
      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
        {title}
      </span>
    </div>
  );
}

// ── Delivery Type Toggle (GrabFood-style) ─────────────────────────────────────
interface DeliveryToggleProps {
  value: 'delivery' | 'pick_up';
  onChange: (v: 'delivery' | 'pick_up') => void;
}

function DeliveryToggle({ value, onChange }: DeliveryToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
      {/* Delivery option */}
      <button
        type="button"
        onClick={() => onChange('delivery')}
        className={cn(
          'flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
          value === 'delivery'
            ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200'
            : 'text-slate-500 hover:text-slate-700',
        )}
      >
        <Bike
          size={16}
          className={cn(
            'transition-colors',
            value === 'delivery' ? 'text-brand-600' : 'text-slate-400',
          )}
        />
        Delivery
      </button>

      {/* Pick Up option */}
      <button
        type="button"
        onClick={() => onChange('pick_up')}
        className={cn(
          'flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
          value === 'pick_up'
            ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200'
            : 'text-slate-500 hover:text-slate-700',
        )}
      >
        <ShoppingBag
          size={16}
          className={cn(
            'transition-colors',
            value === 'pick_up' ? 'text-brand-600' : 'text-slate-400',
          )}
        />
        Pick Up
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CustomerSection() {
  const [searchParams] = useSearchParams();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OrderSchema>();

  const deliveryType = watch('customer.delivery_type');
  const isDelivery = deliveryType === 'delivery';

  const customerErrors = errors?.customer ?? {};

  function fieldError(field: keyof typeof customerErrors) {
    const err = customerErrors[field];
    return typeof err === 'object' && err !== null && 'message' in err
      ? (err as { message?: string }).message
      : undefined;
  }

  const types = ['delivery-times', 'pickup-times'] as const;
  const typeQueries = useQueries({
    queries: types.map((slug) => ({
      queryKey: ["slug", slug],
      queryFn: () => typesApi.getTypes(slug)
    }))
  });
  
  const [deliveryTimesQuery, pickupTimesQuery] = typeQueries;

  const deliveryTimeTypes: TypeOption[] = deliveryTimesQuery.data
    ? deliveryTimesQuery.data.map(dt => ({ ...dt, text: formatTimeSlot(dt) }))
    : [];

  const pickupTimeTypes: TypeOption[] = pickupTimesQuery.data
    ? pickupTimesQuery.data.map(dt => ({ ...dt, text: formatTimeSlot(dt) }))
    : [];

  const contactId = searchParams.get('contactId') || '';
  
  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: ['customer', contactId],
    queryFn: () => customersApi.getByContactId(contactId),
    enabled: !!contactId,
  });

  useEffect(() => {
    if (!customer) return;

    setValue('customer', {
      first_name: customer.firstName,
      last_name: customer.lastName,
      mobile: formatPHMobile(customer.mobileNumber),
      delivery_type: customer.deliveryType ?? 'delivery',
      street: customer.street ?? '',
      barangay: customer.barangay ?? '',
      city: customer.city ?? '',
      landmark: customer.landmark ?? '',
      delivery_time: '',
      pickup_time: customer.preferredPickupTime ?? '',
      pickup_notes: customer.pickupNotes ?? '',
    }, { shouldValidate: true });

  }, [customer]);

  
  if (isCustomerLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="text-slate-400">Loading customer data...</span>
      </div>
    );
  }
  
  return (
    <div className="card overflow-visible">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="card-header">
        <h2>Customer</h2>
      </div>

      {/* ══ SECTION: Customer Information ═══════════════════════════════ */}
      {/* <SectionDivider icon={<User size={13} />} title="Customer Information" /> */}

      <div className="px-5 py-4 space-y-3">
        {/* First Name + Last Name — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <FormField error={fieldError('first_name')}>
            <input
              className={cn('input', fieldError('first_name') && 'input-error')}
              placeholder="First Name"
              {...register('customer.first_name')}
            />
          </FormField>
          <FormField>
            <input
              className="input"
              placeholder="Last Name"
              {...register('customer.last_name')}
            />
          </FormField>
        </div>

        {/* Mobile Number */}
        <FormField error={fieldError('mobile')}>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-md text-slate-500 text-sm select-none">
              +63
            </span>
            <input
              className={cn(
                'input rounded-l-none',
                fieldError('mobile') && 'input-error',
              )}
              placeholder="Mobile Number"
              {...register('customer.mobile')}
              onChange={(e) => {
                const formatted = formatPHMobile(e.target.value);
                
                setValue('customer.mobile', formatted, { shouldValidate: false });
              }}
            />
          </div>
        </FormField>
      </div>

      {/* ── Delivery / Pick Up toggle ────────────────────────────────── */}
      <div className="px-5 pb-2">
        <DeliveryToggle
          value={deliveryType}
          onChange={(v) => {
            setValue('customer.delivery_type', v, { shouldValidate: false });
          }}
        />
      </div>

      {/* ══ SECTION: Delivery Address — only shown for Delivery ═════════ */}
      {isDelivery && (
        <>
          <SectionDivider
            icon={<MapPin size={13} />}
            title="Delivery Address"
          />

          <div className="px-5 py-4 space-y-3">
            <FormField>
              <input
                className="input"
                placeholder="House / Block & Lot / Street"
                {...register('customer.street')}
              />
            </FormField>

            <FormField>
              <div className="relative">
                <select
                  className="input appearance-none pr-8"
                  {...register('customer.barangay')}
                >
                  <option value="">Barangay</option>
                  {SAMPLE_BARANGAYS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </FormField>

            <FormField>
              <input
                className="input"
                placeholder="City / Municipality"
                value="Imus City"
                readOnly
                {...register('customer.city')}
              />
            </FormField>

            <FormField>
              <input
                className="input"
                placeholder="Landmark / Instructions"
                {...register('customer.landmark')}
              />
            </FormField>

            {/* Delivery time */}
            <FormField>
              <select className="input" {...register('customer.delivery_time')}>
                <option value="">-- Choose delivery time --</option>
                {deliveryTimeTypes.map((time) => (
                  <option key={time.id} value={time.id}>
                    {time.text}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </>
      )}

      {/* ══ SECTION: Pick Up Details — only shown for Pick Up ═══════════ */}
      {!isDelivery && (
        <>
          <SectionDivider icon={<Store size={13} />} title="Pick Up Details" />

          <div className="px-5 py-4 space-y-3">
            {/* Pick up time */}
            <FormField>
              <select className="input" {...register('customer.pickup_time')}>
                <option value="">-- Choose pickup time --</option>
                {pickupTimeTypes.map((time) => (
                  <option key={time.id} value={time.id}>
                    {time.text}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Notes for pick up */}
            <FormField>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Pick up instructions or notes…"
                {...register('customer.pickup_notes')}
              />
            </FormField>
          </div>
        </>
      )}
    </div>
  );
}
