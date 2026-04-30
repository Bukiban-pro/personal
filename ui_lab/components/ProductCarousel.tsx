'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/navigation'

export interface ProductCardItem {
  id: number | string
  title: string
  subtitle?: string
  price: number
  discount?: number
  rating?: number
  reviews?: number
  image?: string
}

interface ProductCarouselProps {
  items: ProductCardItem[]
  title?: string
  autoplay?: boolean
  showNavigation?: boolean
  onPrimaryAction?: (item: ProductCardItem) => void
  primaryActionLabel?: string
  /** Format a price value for display. Default: `(n) => n.toFixed(2)` */
  formatPrice?: (price: number) => string
}

export function ProductCarousel({
  items,
  title = 'Featured Items',
  autoplay = true,
  showNavigation = true,
  onPrimaryAction,
  primaryActionLabel = 'Add',
  formatPrice = n => n.toFixed(2),
}: ProductCarouselProps) {
  const prevRef = React.useRef<HTMLButtonElement | null>(null)
  const nextRef = React.useRef<HTMLButtonElement | null>(null)

  const getSalePrice = (price: number, discount?: number) => {
    if (!discount) return price
    return price - price * (discount / 100)
  }

  return (
    <section className='mx-auto max-w-screen-xl px-4 py-12 md:px-8 lg:py-16'>
      <div className='mb-8 flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-foreground md:text-3xl lg:text-4xl'>
          {title}
        </h2>

        {showNavigation ? (
          <div className='flex gap-2'>
            <button
              ref={prevRef}
              type='button'
              aria-label='Previous slide'
              className='flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-border/80 hover:bg-muted'
            >
              <ChevronLeft className='size-5' />
            </button>
            <button
              ref={nextRef}
              type='button'
              aria-label='Next slide'
              className='flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-border/80 hover:bg-muted'
            >
              <ChevronRight className='size-5' />
            </button>
          </div>
        ) : null}
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={
          showNavigation
            ? {
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }
            : false
        }
        autoplay={
          autoplay
            ? {
                delay: 3000,
                disableOnInteraction: false,
              }
            : false
        }
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        onBeforeInit={swiper => {
          if (showNavigation && typeof swiper.params.navigation !== 'boolean') {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
          }
        }}
        className='!pb-2'
      >
        {items.map(item => {
          const salePrice = getSalePrice(item.price, item.discount)
          const hasDiscount = Boolean(item.discount && item.discount > 0)

          return (
            <SwiperSlide key={item.id}>
              <div className='group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-lg'>
                <div className='relative aspect-[3/4] overflow-hidden bg-muted'>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className='size-full object-cover transition-transform group-hover:scale-105'
                    />
                  ) : (
                    <div className='flex size-full items-center justify-center text-muted-foreground/50'>
                      <ShoppingCart className='size-16' />
                    </div>
                  )}

                  {hasDiscount ? (
                    <span className='absolute right-2 top-2 rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground'>
                      -{item.discount}%
                    </span>
                  ) : null}
                </div>

                <div className='p-4'>
                  <h3 className='mb-1 line-clamp-2 text-sm font-semibold text-foreground'>
                    {item.title}
                  </h3>

                  {item.subtitle ? (
                    <p className='mb-2 text-xs text-muted-foreground'>{item.subtitle}</p>
                  ) : null}

                  {typeof item.rating === 'number' ? (
                    <div className='mb-2 flex items-center gap-1'>
                      <Star className='size-4 fill-[var(--color-warning,#eab308)] text-[var(--color-warning,#eab308)]' />
                      <span className='text-sm font-medium text-foreground'>
                        {item.rating.toFixed(1)}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        ({(item.reviews ?? 0).toLocaleString()})
                      </span>
                    </div>
                  ) : null}

                  <div className='mb-3 flex items-baseline gap-2'>
                    <span className='text-lg font-bold text-foreground'>
                      {formatPrice(salePrice)}
                    </span>
                    {hasDiscount ? (
                      <span className='text-sm text-muted-foreground line-through'>
                        {formatPrice(item.price)}
                      </span>
                    ) : null}
                  </div>

                  {onPrimaryAction ? (
                    <button
                      type='button'
                      onClick={() => onPrimaryAction(item)}
                      className='flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'
                    >
                      <ShoppingCart className='size-4' />
                      {primaryActionLabel}
                    </button>
                  ) : null}
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}
