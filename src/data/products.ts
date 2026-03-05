export interface ProductVariant {
    id: string;
    colorName: string;
    colorHex: string;
    mainImage: string;
    hoverImage?: string;
    galleryImages?: string[];
}

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    features: string[];
    description: string;
    badges?: string[];
    variants: ProductVariant[];
    sizes: string[];
}

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "Sculpt High-Waist Legging",
        price: 98,
        category: "Leggings",
        features: ["High compression"],
        description: "Our best-selling sculpt leggings in classic Onyx Black.",
        badges: ["New"],
        sizes: ["XS", "S", "M", "L", "XL"],
        variants: [
            {
                id: "v1-1",
                colorName: "Onyx Black",
                colorHex: "#000000",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW4agRD7J_xjJ90SmOq5pshRQ2zGdI366APgCXhpFRQFLIzV3DO79m0V7CjhNkLGGBioj62I7Th3nf5W-PQJMfGW6wxVSL91_SKvOnfcOTa7O3kq9KhvXuJRnxzdcFDeTpvm6t192qIcu_QkYtNZqVsNXqutaCd9nV5nyPq3zCkeqYvyU0e-ByAmeGUPWchsy0ZOLYJzN6Gryg4v12zNcKW2MWRiUjdn7bbM-VPosU4iO7KFk1DXu85GR3iUyRUTn_wmXJJ8L9ZNPx",
            }
        ]
    },
    {
        id: "p2",
        name: "Aura Asymmetric Bra",
        price: 58,
        category: "Sports Bras",
        features: ["Medium support", "Asymmetric strap"],
        description: "A statement piece designed to turn heads while providing necessary support.",
        sizes: ["XS", "S", "M", "L"],
        variants: [
            {
                id: "v2-1",
                colorName: "Sage Green",
                colorHex: "#8A9A8B",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5pRz_Tda31j-gI00nFI2yZQe00mSMSoRhLPwYqHn6tQtIBsaMv3Aiz4Yji8W3zQRbU3z_PF_hAmMXeOiBqgduEoHZCk8W1wkdgG4dZN5Mla05lxv5wRTmqcQHL77CZhWl811uZXZqxCiLja94Ywv6sP5j2PFqo6Lv9tfTPqL344M_kWYrcZuM3bAuyZh5YoBvC56m0-vjEWvseNBMVRDxltl6mKCAPsJroGPbZ783-dLzMcLux0CWjYleageZQ5-GRLzB5Kjvv803",
            }
        ]
    },
    {
        id: "p3",
        name: "Core Seamless Long Sleeve",
        price: 72,
        category: "Tops",
        features: ["Seamless design", "Breathable"],
        description: "A perfect layering piece for warm-ups and cool-downs.",
        sizes: ["XS", "S", "M", "L", "XL"],
        variants: [
            {
                id: "v3-1",
                colorName: "Ivory",
                colorHex: "#F2F1ED",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT7cFkNcXKcxPylJJvro1qNa7WgBcajO3LvpzB6JZQoyPCmo6ugR0v-5YtKFd9XbJCcs1MxxdKHDO0qj_Ap51xsFmmhW39bo3UVSNbA0EDWjc2w-1zyml4FMUKtSjIFu9Knj2F-zSlpX_nRPA0W-1ZC7GgET615tz0YU11WEAyX4qNqpo_ybyo9AUdkGl78HYLMyiYEf0Y_hKs81vABENBOIo-kHNDWS8b0ssGL2ZKlyd0o2zG1OoJe8W9HWOjDc8kF9JwTI1BsipH",
            }
        ]
    },
    {
        id: "p4",
        name: "Motion Biker Short",
        price: 64,
        category: "Shorts",
        features: ["Sweat-wicking", "Squat proof"],
        description: "Designed for cycling, lounging, and everything in between.",
        sizes: ["XS", "S", "M", "L", "XL"],
        variants: [
            {
                id: "v4-1",
                colorName: "Midnight Blue",
                colorHex: "#1A2C42",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-UGol9RHq9Z7IDVhLjSA_21kdWgRKlG1gqpbJ7u94TBMmZyWH5Ntw5EpTcq3L_fSApECZBfmsPvG0M2xmJXgG4Innv-t8770LwF7DTa_3AX4-JR7wwONrxg_S8VnqQMn5I1mLUnAFsMtDOHe4j6p0QGj48DkB8qLdSHpeVh5PTxvPmmDDtJYELqtQj0P35IKy7NqfF-U9sjVWOzsftO2yJke8dibX2DYlptJlLUB6Fbc0dsipDg0HltcxA3feWse7OrVORKzDhdd0",
            }
        ]
    },
    {
        id: "p5",
        name: "Essence Ribbed Legging",
        price: 88,
        category: "Leggings",
        features: ["Ribbed texture", "Soft stretch"],
        description: "Your new go-to leggings for yoga and pilates.",
        badges: ["Bestseller"],
        sizes: ["XS", "S", "M", "L"],
        variants: [
            {
                id: "v5-1",
                colorName: "Black",
                colorHex: "#000000",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFKhleHQmbJrbZ4Bbfsdl92ZBpKoHlScrpAVnXNOpvrOkHji-lAEZJBBgbNw8otHZJkRL5xM-hJtMpNgGU_q14WUc7jKV2iNgMOvAzWwGDKalDuLTsYpzhIH-k21FlQbqKCwjKiqb4AbRl_nESSPRwpz2rq7K0ufM2VsTbENYcjKbzQ78TJ94_WFIxkuIrPjKfy8dZQOUoTBMVvtGtZWzSCyGAPcFTN0u_pwYvAFiWvBpLJV_2UbV1PK1nSPRNgIhB9YDmDU-XuIiN",
                hoverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJAy96NVJJFF8P6P-d_ruf0oRyNse73E6xoWLFlb-OgL1_aGbObVsFAzRHOg2MpFeKtJ0Ulr4JBOU89wJfztZMYoLac8z8w-MGG0cU7LgtyQT5J6EskiYtXnEW0R89a-bU0HBB3iyR8ldtWYTwVPgO8HLLgm-ycolN7Rm2IJKeZ533uxS4ZIfcu1ILa-nqXZx1TQuBedKBeQdaZx0bn0UMIuUi_oXUxWQ8QYK2-VrNok1nuLdrl-_zPav_-MIt-cqU1nCFHadWOgco"
            },
            {
                id: "v5-2",
                colorName: "Charcoal",
                colorHex: "#4A5568",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFKhleHQmbJrbZ4Bbfsdl92ZBpKoHlScrpAVnXNOpvrOkHji-lAEZJBBgbNw8otHZJkRL5xM-hJtMpNgGU_q14WUc7jKV2iNgMOvAzWwGDKalDuLTsYpzhIH-k21FlQbqKCwjKiqb4AbRl_nESSPRwpz2rq7K0ufM2VsTbENYcjKbzQ78TJ94_WFIxkuIrPjKfy8dZQOUoTBMVvtGtZWzSCyGAPcFTN0u_pwYvAFiWvBpLJV_2UbV1PK1nSPRNgIhB9YDmDU-XuIiN"
            },
            {
                id: "v5-3",
                colorName: "Burgundy",
                colorHex: "#9B2C2C",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFKhleHQmbJrbZ4Bbfsdl92ZBpKoHlScrpAVnXNOpvrOkHji-lAEZJBBgbNw8otHZJkRL5xM-hJtMpNgGU_q14WUc7jKV2iNgMOvAzWwGDKalDuLTsYpzhIH-k21FlQbqKCwjKiqb4AbRl_nESSPRwpz2rq7K0ufM2VsTbENYcjKbzQ78TJ94_WFIxkuIrPjKfy8dZQOUoTBMVvtGtZWzSCyGAPcFTN0u_pwYvAFiWvBpLJV_2UbV1PK1nSPRNgIhB9YDmDU-XuIiN" // placeholder reuse
            }
        ]
    },
    {
        id: "p6",
        name: "Essence Crop Tank",
        price: 45,
        category: "Tops",
        features: ["Built-in bra support"],
        description: "Versatile crop tank for low impact workouts.",
        badges: ["New"],
        sizes: ["XS", "S", "M", "L"],
        variants: [
            {
                id: "v6-1",
                colorName: "White",
                colorHex: "#FFFFFF",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4dOKd6kKwYnvUVSXWVPqWOlwkYf8St16hzjPhvh47mWPKpZtiUpFoHW9fsQ52XDrqgdlwROCHOiGw8ET--sfvIB3j5c9ULbh3frX-Yozw-npUM6pdOs0CzyPigIE8JWz7GRFQ7LfUbKre6-RQBOeI21d_YA_7HtZlmH0oBC_rnuWP93dooPCnWGN5B0yrdWUU5DiI-AATq9wJwoIlMScyRKJTzd1MU_7RS8Rw_AHQRUXy-gSuJI90Z5RvspTWI1JBnxwSTkpCMmsq",
                hoverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_OszNVkKEnXBshEQdgxh4r1v4A4yGuC7VCPDlpaUaqxPfoPmaVvxq0TPezKc0KoWehAfN3lbuw-BHV-a4X6nyB004GGQ7hm0Qa0_atfop22zIsfgr38GtoHnCGl2ir3vIS8oFmFG8ImHI-xrfwnBZCXqt-Q4J08hCk5DBBs8VgVtA7tezKtkx4j2cdFrPzBctyzUvmRGQbd8KOtMjvVkwlvl0uoQ7FuvKr7vxnAXxfPnWssjzRvnDsKisDLG8WLnNieJ_7eyWLNdH"
            },
            {
                id: "v6-2",
                colorName: "Black",
                colorHex: "#000000",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4dOKd6kKwYnvUVSXWVPqWOlwkYf8St16hzjPhvh47mWPKpZtiUpFoHW9fsQ52XDrqgdlwROCHOiGw8ET--sfvIB3j5c9ULbh3frX-Yozw-npUM6pdOs0CzyPigIE8JWz7GRFQ7LfUbKre6-RQBOeI21d_YA_7HtZlmH0oBC_rnuWP93dooPCnWGN5B0yrdWUU5DiI-AATq9wJwoIlMScyRKJTzd1MU_7RS8Rw_AHQRUXy-gSuJI90Z5RvspTWI1JBnxwSTkpCMmsq"
            }
        ]
    },
    {
        id: "p7",
        name: "Sculpt Long Sleeve",
        price: 65,
        category: "Tops",
        features: ["Form fitting", "Moisture wicking"],
        description: "Keep warm and perform at your best with our Sculpt Long Sleeve.",
        sizes: ["XS", "S", "M", "L"],
        variants: [
            {
                id: "v7-1",
                colorName: "Charcoal",
                colorHex: "#4A5568",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYALUohE7UxST33cY3dNiVSqB1WqACyOhCgQboPKdAxyVa3-tU5GEVXPGxjukAxqGKCKAHRAphMAcnZJkywv-FVWm7ASTfRi0RPbl9bWCKi8Wf7unc3KIeiADozL5-tss2UNc6c2erryAxqKMoqFZYlY1G_Fg3vD2nzsKbhThqtyUdkPEgA2Mez4gSn4JPF8lPozqkaLM_C3CGMjoasIgxid_S04qe5sz0zAU4yjcLdr8_XAcqKjTfEV8-9eg4QyFGksFWIkXP1Srn",
                hoverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwrPwgwKLxMnwrX7ak_XEXBWTTa1OvsGMxUKNcO7o2mFYpjW99ZfqFV5avTOuzxLnHalw9P7NbK1EdFCfAk3Yns6eM5X9RQbTeTJFAzgchOTqYUfozrcIihGQc-zeR1HYarYX9zeM1rl0hVbtlnoTB9v9P3pPQXO5-HD5dRE4X33pBj1u-tFpnYIjEI-mFYaZQL2n-A5AfMgj_35saYd5ZmzVZxdjpH6MLviw-0y7Kxq0bzgqwVjW-Q4Z7RMLr5YuCaSZ1WQcK23B0"
            },
            {
                id: "v7-2",
                colorName: "Light Gray",
                colorHex: "#E2E8F0",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYALUohE7UxST33cY3dNiVSqB1WqACyOhCgQboPKdAxyVa3-tU5GEVXPGxjukAxqGKCKAHRAphMAcnZJkywv-FVWm7ASTfRi0RPbl9bWCKi8Wf7unc3KIeiADozL5-tss2UNc6c2erryAxqKMoqFZYlY1G_Fg3vD2nzsKbhThqtyUdkPEgA2Mez4gSn4JPF8lPozqkaLM_C3CGMjoasIgxid_S04qe5sz0zAU4yjcLdr8_XAcqKjTfEV8-9eg4QyFGksFWIkXP1Srn"
            }
        ]
    },
    {
        id: "p8",
        name: "Essence Bike Short",
        price: 48,
        originalPrice: 58,
        category: "Shorts",
        features: ["Squat proof", "No front seam"],
        description: "The perfect companion for intense training sessions.",
        badges: ["Sale"],
        sizes: ["XS", "S", "M", "L"],
        variants: [
            {
                id: "v8-1",
                colorName: "Burgundy",
                colorHex: "#9B2C2C",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtyXfdqIzgSg-sF9xCf0qpKzs6Z7wlkbGEJZat3Pm_CTcmZOGYlTiwN5jdcagCZVqRuD8YccERsKCkue82s_7pDCcZdMxkx5Jx_watUfm7eLY0k-p7DugEOxmWuSHUPcJfNroj7CEf6OH6d0q3IiKSPXQbYt9BLq3_wW5BqVrBnTAVSjuzc_7MmHqUGGGoBAEHoIN2hYUBialdH0yTH-816uL0K2iTgo1zR6gJ5ThpLjhrX6IOQ_1IPUNMjkN2cuAmeNzfvHUSlRcC",
                hoverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEK2Nu0xKlSgG2uhrJWlX3rokZCwlcdWgLpPl4oHiMdr6PFhvmF65XPJWmjNQUG89RIHV9ovEW5HYXJY8BANK87sHvqXBy5KWBtpdfiS2XUR9DyaOgbX9uqR2tW4KZCm59qKuO_-oMcA959ycxPIGtYk6ZhWvitGHIVMkFnWsL0tqJJ1RdVv_TGR15p7ZT6Jt1wap2qJj4Ak9rAPAcj73jQ93Uwl0rp6JmCkKdk4mRi0ufr568M1QATcMM__8EXaE379VswicuGkxg"
            },
            {
                id: "v8-2",
                colorName: "Black",
                colorHex: "#000000",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtyXfdqIzgSg-sF9xCf0qpKzs6Z7wlkbGEJZat3Pm_CTcmZOGYlTiwN5jdcagCZVqRuD8YccERsKCkue82s_7pDCcZdMxkx5Jx_watUfm7eLY0k-p7DugEOxmWuSHUPcJfNroj7CEf6OH6d0q3IiKSPXQbYt9BLq3_wW5BqVrBnTAVSjuzc_7MmHqUGGGoBAEHoIN2hYUBialdH0yTH-816uL0K2iTgo1zR6gJ5ThpLjhrX6IOQ_1IPUNMjkN2cuAmeNzfvHUSlRcC"
            }
        ]
    },
    {
        id: "p9",
        name: "Signature Seamless Legging Set",
        price: 128,
        category: "Sets",
        features: ["Seamless", "Ultra-soft fabric", "High waisted", "Medium support bra"],
        description: "Experience unparalleled comfort and support with our Signature Seamless Set. Engineered with ultra-soft, sweat-wicking fabric, this set moves with you through every squat, stretch, and stride. The high-waisted design provides a secure, flattering fit, while the minimalist aesthetic ensures you look as good as you feel.",
        sizes: ["XS", "S", "M", "L", "XL"],
        variants: [
            {
                id: "v9-1",
                colorName: "Slate Gray",
                colorHex: "#4B5563",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnbizZ_RHhmkOImP_kZeqMk-uxN8iDMTGoLY5_gg-DuznRFshLP9GeYfH9gBhym2SCgjvKsI5xD2UMaomctf50-RWro5sEzplCuw8MOgfTyV687WR9xt8MFb4giv1uaL65aGTqT-J8btOm63efWn2Fu4C-4X4HoAO05jAdlsk7e5mIMsmIriqtmvGBmsPgnIA6DIUcMpkltj23utGwUiBK7QiLgrWXNwRJjOnPJtCApxh1DPOWGApi2AHnjiazpd3_4zdwsHtB62OJ",
                galleryImages: [
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBnbizZ_RHhmkOImP_kZeqMk-uxN8iDMTGoLY5_gg-DuznRFshLP9GeYfH9gBhym2SCgjvKsI5xD2UMaomctf50-RWro5sEzplCuw8MOgfTyV687WR9xt8MFb4giv1uaL65aGTqT-J8btOm63efWn2Fu4C-4X4HoAO05jAdlsk7e5mIMsmIriqtmvGBmsPgnIA6DIUcMpkltj23utGwUiBK7QiLgrWXNwRJjOnPJtCApxh1DPOWGApi2AHnjiazpd3_4zdwsHtB62OJ",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuA35zhY7u1JsAGHDz9_G_sLI7KwfdAOpNnMBk8g2jmM63NLZ9r_CHr43N4Potq4p2j2omLyZt7LxrrVJ2IvXN6oNakcmZ7QKBT5qV1xkHv2Et7ZKC3J30b6YIV0_HX7LLFj756SCcTrpvaeUFj_o2wEYU64O9choYnyHg9b6Ndvs2PBDmViTebvh0KTBD_GxgxBTMluBALw03DdytOhonbIiha0W1VfVgR5PG3ReadMHoyzq9NLVbToMWzSnhaO_OFJSGsnQiq4aYxS",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBbc-ipyyRB2ESu-9vTPZDDRqAppZE2KbUnB-TpU-fK2X7qFvryIgVNrO3RyM9LErTrOy6oOksiMCBmqDEJGZIQf099RQu2cCc_cjvbJKRhet6_aGXG639Um-XnAcossIJsdCsMRlHILg3Mmm8Gs7aY1ESkQrCL2A7AhieGNZCXfLnUQNx1kTepJRNS9PpaFeGosvdjYg7cBywGdn7R0uWjU4HEP9fdhAf0z2nFKR5-BHVec9km1gtMDNT_GOFJASzyPH_s6ccxErGy",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuA4B6z3ZY11eGG8nNRHvEpv2ldoX7fW6I8ITh8WYJj34RXkvrmKd0wPznaYmBFXhDDtFzrH3ws6VpkoZ1L20ToaqNN-ecDS_ujJ_nVXhM7AtczUl0jonugK5ahw-mB44k2B7Qbdth0qLG_Avhy3ilIGkMx9kfxKa8YUznsKz3FLNDUEKZjFsiSzcdBYgYaMz0vILPczG_ArxiGEGTr0M1LD2Y5kyhyLYeB9l_BQUTOsbIgvStWRaRXQBJmbZIj0R0R61OlftM-JrwdS"
                ]
            },
            {
                id: "v9-2",
                colorName: "Onyx Black",
                colorHex: "#000000",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnbizZ_RHhmkOImP_kZeqMk-uxN8iDMTGoLY5_gg-DuznRFshLP9GeYfH9gBhym2SCgjvKsI5xD2UMaomctf50-RWro5sEzplCuw8MOgfTyV687WR9xt8MFb4giv1uaL65aGTqT-J8btOm63efWn2Fu4C-4X4HoAO05jAdlsk7e5mIMsmIriqtmvGBmsPgnIA6DIUcMpkltj23utGwUiBK7QiLgrWXNwRJjOnPJtCApxh1DPOWGApi2AHnjiazpd3_4zdwsHtB62OJ"
            },
            {
                id: "v9-3",
                colorName: "Sage Green",
                colorHex: "#8A9A8B",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnbizZ_RHhmkOImP_kZeqMk-uxN8iDMTGoLY5_gg-DuznRFshLP9GeYfH9gBhym2SCgjvKsI5xD2UMaomctf50-RWro5sEzplCuw8MOgfTyV687WR9xt8MFb4giv1uaL65aGTqT-J8btOm63efWn2Fu4C-4X4HoAO05jAdlsk7e5mIMsmIriqtmvGBmsPgnIA6DIUcMpkltj23utGwUiBK7QiLgrWXNwRJjOnPJtCApxh1DPOWGApi2AHnjiazpd3_4zdwsHtB62OJ"
            },
            {
                id: "v9-4",
                colorName: "Midnight Blue",
                colorHex: "#1A2C42",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnbizZ_RHhmkOImP_kZeqMk-uxN8iDMTGoLY5_gg-DuznRFshLP9GeYfH9gBhym2SCgjvKsI5xD2UMaomctf50-RWro5sEzplCuw8MOgfTyV687WR9xt8MFb4giv1uaL65aGTqT-J8btOm63efWn2Fu4C-4X4HoAO05jAdlsk7e5mIMsmIriqtmvGBmsPgnIA6DIUcMpkltj23utGwUiBK7QiLgrWXNwRJjOnPJtCApxh1DPOWGApi2AHnjiazpd3_4zdwsHtB62OJ"
            }
        ]
    },
    {
        id: "p10",
        name: "Aero Impact Bra",
        price: 54,
        category: "Sports Bras",
        features: ["High impact support"],
        description: "Designed for your toughest workouts.",
        sizes: ["XS", "S", "M", "L", "XL"],
        variants: [
            {
                id: "v10-1",
                colorName: "Frost White",
                colorHex: "#ffffff",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD14_7Rk7gYf-3-AI_znAgUAKOvLy8otRL-9ekCO7UeFIEs-HcE0oqJShrohXRfzUFuy_CfvgJ5-iQMV2RM7YyPy0LC1lGGc6lrndUBGayl-Srab3uAjcdBoy7i_iuB7V49LWv8TrOc41M99_mfCc5z8Q0PtI3jWrNlywyLtcdl_LJs8id2-5Q-qO-Oo0sRLNCgpPFUMzmewSDoqqZi21_48VScpLRhmo47K1vYyW6BRUs6fYqACVMHQjITWS60c32KRUZ5huwJDNdK"
            }
        ]
    },
    {
        id: "p11",
        name: "Velocity Crop Hoodie",
        price: 72,
        category: "Hoodies",
        features: ["Cropped fit", "Fleece lining"],
        description: "Ideal for warmups and casual wear.",
        sizes: ["XS", "S", "M", "L"],
        variants: [
            {
                id: "v11-1",
                colorName: "Heather Grey",
                colorHex: "#cbd5e1",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk9bWJ6w0MvRTtCecdEsmdRTm4qOS2Up-A4EW-J2Zd8f4RjGUQBr35VoJS74sEUavPruAE-EOVROVDB9Vl_4pJhw6cbkr9p5TUECn1KJhPNQ3O3x0ZOV1a_qSZfgl-C-TZQjCCV9HIl4IM9hapoJCZGHGHpUmNzC_SLS5leVE1Xcp4wFnR85IRiTIA9iYiSViOYTO3-OM19oVZsy2pWuHXeVPwIAuzdz1k1Gk3jkNKt1FS8vBXBXhLhnYePtNeKZVPoFZAiB1Q7Z1k"
            }
        ]
    },
    {
        id: "p12",
        name: "Flex Biker Shorts",
        price: 48,
        category: "Shorts",
        features: ["4-way stretch"],
        description: "Everyday comfort with performance in mind.",
        sizes: ["XS", "S", "M", "L"],
        variants: [
            {
                id: "v12-1",
                colorName: "Pink",
                colorHex: "#f472b6",
                mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiQGT_-glLHkqV4n22oHYimkZUj6d7_Gl450UB_Ou_7FjnyAGkb1YmdHrbaPeq_4bveTWE2A-BiQ41KBfmQkvvWHBhAdTaVwnG7LD8Ndgrf_bhxAM1SAsa9xcKHVop19aeCQIZKjKFYqLCNy07DLVegodXGA-w7a9CSMA9XZ4HrknN0FCmQ50AiXy7b53xpxKcOFgEJB20528vYFmg8v2_mJmbsy2BrGhhr2XpPDxzVgE2OUtRTrAEI36wSFHU57n7Blxci0O1H-0u"
            }
        ]
    }
];
