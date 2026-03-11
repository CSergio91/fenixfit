import Image from "next/image";
import Link from "next/link";
import { productService } from "@/services/productService";

export default async function Home() {
  const products = await productService.getAllProducts();
  const banners = await productService.getMarketingAssets('banner_home');
  const settings = await productService.getSettings();
  const currency = settings?.currency || '$';

  const justDroppedProducts = products.slice(0, 4);
  const heroBanner = banners[0] || {
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDa_ZarHO-Uxcx1X6FtcqkINGYFcF4s3jqrwow9TkiDgFYShi7zFlbJ2hnnQ7kZYK_S43Xu5n-KPubxDsYNqHPLEB8R8ijXCx33Sg8mES5FfwwFUakU_sKe9inQTT6PTfJ4ksu7ve_NOaEmg1_JZ4YxT0lzMxSvrcw-_nGLTFJ-1ifV2DRmayaZApkca7y23HjSSIbRNG46TvEsgC4xrv18EvoN_lY6JATH9O1TIPXvsj8GQs2DMk2HepfxqPvwOrGjA6Trm0b3_0XH",
    title: "Define Your Movement",
    description: "The new ultra-modern collection by Tahi Cruz. Designed for performance, engineered for elegance."
  };

  return (
    <>
      {/* Hero Section - DYNAMIC from Supabase */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src={heroBanner.image_url}
          alt={heroBanner.title || "Tahi Cruz in Fenix Fit activewear"}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-6 tracking-tight drop-shadow-xl uppercase italic">
            {heroBanner.title?.split(' ').slice(0, 2).join(' ')}<br />
            <span className="italic font-light">{heroBanner.title?.split(' ').slice(2).join(' ')}</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl font-light drop-shadow-lg">
            {heroBanner.description}
          </p>
          <Link href="/collections" className="inline-block bg-white text-primary px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all shadow-xl">
            Shop New Arrivals
          </Link>
        </div>
      </section>

      {/* Just Dropped Section - DYNAMIC from Supabase */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 block mb-4">Latest Release</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-2 tracking-tight">Just Dropped</h2>
            <p className="text-muted-light text-lg font-light italic">The latest innovations in performance wear.</p>
          </div>
          <Link href="/collections" className="hidden md:inline-flex items-center text-[11px] font-bold uppercase tracking-[0.2em] hover:text-primary/60 transition-colors border-b-2 border-primary pb-2">
            View All <span className="material-icons text-sm ml-2">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {justDroppedProducts.map((product) => {
            const variant = product.variants[0];
            const isHotSale = product.original_price && product.original_price > product.price;
            const isLastUnits = product.stock < 10;

            return (
              <div key={product.id} className="group relative">
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50 mb-6">
                  {variant && (
                    <Image
                      src={variant.main_image}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <button className="w-full bg-white text-primary py-4 text-[10px] font-bold tracking-[0.2em] uppercase shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:bg-black hover:text-white transition-all">
                      Quick Add
                    </button>
                  </div>

                  {/* DYNAMIC BADGES */}
                  <div className="absolute top-6 left-6 flex flex-col space-y-2">
                    {product.badges && product.badges.map((badge, idx) => (
                      <span key={idx} className="bg-primary text-white text-[9px] font-black px-2.5 py-1.5 uppercase tracking-widest self-start">{badge}</span>
                    ))}
                    {isHotSale && (
                      <span className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1.5 uppercase tracking-widest self-start">Hot Sale</span>
                    )}
                    {isLastUnits && !isHotSale && (
                      <span className="bg-orange-600 text-white text-[9px] font-black px-2.5 py-1.5 uppercase tracking-widest self-start">Last Units</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <h3 className="text-[14px] font-bold tracking-tight">
                    <Link href={`/product/${product.id}`} className="hover:text-primary/60 transition-colors capitalize">
                      {product.name}
                    </Link>
                  </h3>
                  <div className="flex justify-between items-center pt-1">
                    <p className="text-[12px] text-muted-light font-medium">{variant?.color_name}</p>
                    <div className="text-right">
                      <p className={`text-[14px] font-black font-display ${isHotSale ? 'text-red-600' : 'text-primary'}`}>{currency}{product.price}</p>
                      {isHotSale && (
                        <p className="text-[10px] text-gray-400 line-through font-bold">{currency}{product.original_price}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center md:hidden">
          <Link href="/collections" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-2">
            View All <span className="material-icons text-sm ml-2">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Studio Collection Banner */}
      <section className="py-12 max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gray-900 h-[70vh] flex items-center shadow-2xl">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUcXu3bTR9MFEjzbnBUzmNIUk2sWDjXQkWWbx2-YKErkXgD_Axc5ARBmQHUnEhesnbZAah68Sc2OURdpXmKOtryIA0-fy1X-G07xU5iENV57bcf9aoJgLdtA0fytDWlUerHk0o2uHkLVsulZX80cXVogACb4D49vFS8FGAuQh0w3F2lok9iAy8kB5EoMPFAevH_mHbXBW7B6xQSEOrlVkdhASX6n9GnTilqpP5uO9U-RpopUS6hyFYUpoo1dmwc1BR7-TRGwEjRCKk"
            alt="Sustainable Luxury"
            fill
            className="object-cover opacity-70 mix-blend-overlay"
          />
          <div className="relative z-10 w-full md:w-3/5 p-8 md:p-20 lg:p-32">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/50 block mb-6">Sustainable Luxury</span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-white font-bold mb-8 leading-[1.1] tracking-tighter">The Studio<br />Collection</h2>
            <p className="text-white/80 text-lg md:text-xl mb-12 max-w-md font-light leading-relaxed">Buttery soft fabrics designed for low-impact movement. Move with unparalleled freedom and aesthetic poise.</p>
            <Link href="/collections" className="inline-block bg-white text-primary px-10 py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all shadow-xl">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Activity */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 block mb-4">Functional Versatility</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Shop by Activity</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { tag: "Yoga", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBO0LLcm7vRhbz91amPB6RHY_Ce9uTvCHzhqDCVnhdckjf1r_PCh-J_qeDAowcvtBzTu4szdxtrptSk73AbyGHmPICKYt8uh7OeYwVvg27OMCnfYEz0X7YeKlDRaGWQN5sk4CALJgIL5VmMT0sh4P6Hq96iho8jw1dNEnnkiZ7qInkF5SmPX8LJpYyFJPRsaLuHn3Ku4KaAsLA8UU-tNET8mc_ZjzcC8vtNsvz0P0QcrhXdsjaIyChrPPl0UI2BEbV9n9STzuoSXwbF" },
            { tag: "Train", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_1CqYrVGYefMbike8ket5b14o7mU-p5yZKyKrYAAYFE-xGFgSmqNRrEvEgDOcJnnmLqjB2wLsV1ERsHrHrBOBZzcrFIGzxSyaOFhTrp_cAlSzN8CVUgauoout77i1HC-Rwjg8-k9_-Vn1-0V9jvQG5QiZJnNr9oX56rHrxchGRO5ufLMGDv-UlpecAAe5jQaMgUysWfnfatPqCIWSAB37jxiyXVlBCqoKSC6sHDNEcjg_9mFMiJvVAoSN9ip4tMi3GaYl4ARl8kbM" },
            { tag: "Lounge", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBddb7xKK36zm062Ok0Fjrn7_h949rUXNw5opk1v58UJsM6wuMTg1C_t5H9zhV4lJ_z0_ffKSjhqzcDumqwX3jeINAHWpiyOvY6O9GV1VuAZTZfs5IqwZXXohR3ocB5knI5NsdlioBuK0BhvSo61cQQ61ULnq01OPN_fLdgDu7cwAGEIHvQeARNAFxkmYgbGLiMf_lJTYm8Z8QjA2oDYJJQo6hcbITw_uZXNe_ctImE3EFBfU1jA382zUE2NF5axQ0Y7dTcQS_dJ-aD" }
          ].map(activity => (
            <Link key={activity.tag} href="/collections" className="group block relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
              <Image
                src={activity.img}
                alt={activity.tag}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 p-10 flex justify-between items-end">
                <h3 className="font-display text-4xl text-white font-black tracking-tight uppercase italic">{activity.tag}</h3>
                <span className="material-icons text-white bg-white/20 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all shadow-xl">arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Community / Instagram Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100 mt-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 block mb-6">Join the Movement</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-16 tracking-tight">
            <a href="#" className="hover:text-primary/60 transition-colors">@fenixfitbytahicruzz</a>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAUQtp8aaklfyljUe06RBHxx4cVO2tSMwnoOP-HwmRptzj7kFfS50lX3-LFqDDBicEE-lv_v5MhJcCclOAKQYy1KbLyhqJyTD-NPDj4Ju8msEeINcvECqZ_UrfKWeui-XVU_cth2277wcG-WcmWAZbOC2EnGxmkNWQSgM_yGgMLZX7SjeGGLPTjOHuFYMalOYHO5g6F1ZTCseJYm8RMPfkuTyR743qldr-GuQk0JoInVhlJYS5hHvUW8t7SUj2YPQ7AWwhbKCORCkqO",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuARs-yDcIfP1nju1innrGISMXdnPXch5pHW8dlk_b3BdsrKW1qXOXT5USe1mki3-Q71JVh78EQE_uLaxWh6O75fWrga8xcn_sNaih3ciSe-28FfW7UL1rAmKVT1rZwbOGpuhAKgA1FtupibGy1UWLdBztba4r31DTz-8Yfl7Ia7WdwlkDUbb_ZpKh6mMRT2iprapTGFt656X6_iAP3m3cLgyIosUvbCtBhgwWqdvX5dC-cF-k4akN45We-gf_9JsfqhLquQkQHAk-IV",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBSPsNd1otIctJWj3KI4EqmV-fyKt82c3RX7835qPzqdkIbPsuI-F2_q8qnsBF3PDZ-0kOOFA6G8d4BkXfctX6mnuma2CIvAK0qBA3c4N_8DT-ViXZ0s5dCOMeonJqCOyUCDD3jxGc0jIN7fPKVBKvSYLZ8M22NI5XIWKB9mzF6cOFdLbg5KJY9IqrDDYihb9L4307gFbIPv1f5bC_Nsi8gUWN8XIty34ItRDHHT5_8TS1hbSsQQO82Cq3P8V1Lx4UcGY5kqwlkRZA5",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_C3B9MmbilhqSTrC-TV_0t1gKP0JzzjExdARnVuu7BvPpJ3_CJmeSQpGsaVkQQbjNWk_8VS7sTfcmvdWhCzm6THV5gONFQeVT0dc2k2KO5jMZfErXPnRc9ngHAFKsq5bXQzxvN5Xw4Kf4aCGD7Zuh71rfVYtzoaWiPtkAHerkqpAL1uyMHegwRWAhKyjV4tGbPA-NgY4R1sX2LVLi7LL6eeDe0Sw2H1y1nHwkVxdNZut44mnSQ48xIubjTcQ-vnUnKOZoXHB0Qfz",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDjEcfGIG9Gkss6mqjpbul_Rm4WuVWu_2LCq3lpDUz5vQshD8E-PkMCt_WrpeDXAdefqxC0RXqcukXoPyyIptZC44UJDR5eujt5tyUttfn4NTiC7XToo31SwVU3QevdyzczHboiuXPIc-VWjPAUhLiQGGhg7ikW2mXQjJjyAxtK0HkH0J3FQRhgHjJ9f_HOzYiPjvQqMS-kPzkLD_nR18nsDgETEQD6EO1MHmG2zuTzZJEDP2tNr_Ew9RGdeAXdrjK3OOCHFaSD-Rgm"
            ].map((img, i) => (
              <a key={i} href="#" className={`block relative aspect-square group overflow-hidden rounded-2xl shadow-md ${(i === 3) ? 'hidden md:block' : ''} ${(i === 4) ? 'hidden lg:block' : ''}`}>
                <Image src={img} alt={`Instagram ${i + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-icons text-white text-3xl">favorite</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
