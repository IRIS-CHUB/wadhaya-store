import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownLeft, ArrowLeft, ArrowRight, Check, ChevronDown, Globe2, Menu, Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react'
import './styles.css'

const products = [
  { id: 'sarab', name: { ar: 'سراب', en: 'Sarab' }, type: { ar: 'عطر فاخر', en: 'Eau de Parfum' }, price: 420, size: '100 ml', note: { ar: 'عنبر دافئ • زعفران • أخشاب ثمينة', en: 'Warm amber • Saffron • Precious woods' }, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85', tag: { ar: 'الأكثر تميزاً', en: 'Signature' }, description: { ar: 'رحلة حسية بين دفء العنبر وغموض الصحراء عند الغروب. توقيع عطري عميق، أنيق، ولا يُنسى.', en: 'A sensory journey through warm amber and the mystery of the desert at dusk. Deep, elegant and unforgettable.' } },
  { id: 'rabdan', name: { ar: 'ربدان', en: 'Rabdan' }, type: { ar: 'عطر خشبي', en: 'Woody Perfume' }, price: 360, size: '100 ml', note: { ar: 'عود • جلد • توابل ناعمة', en: 'Oud • Leather • Soft spices' }, image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1000&q=85', tag: { ar: 'طابع شرقي', en: 'Oriental' }, description: { ar: 'شخصية واثقة تستحضر أصالة العود ونعومة الجلد، بلمسة معاصرة متوازنة.', en: 'A confident composition of authentic oud and supple leather, balanced with a contemporary touch.' } },
  { id: 'layl', name: { ar: 'ليل', en: 'Layl' }, type: { ar: 'عطر مسائي', en: 'Evening Perfume' }, price: 390, size: '75 ml', note: { ar: 'ورد داكن • مسك • فانيلا', en: 'Dark rose • Musk • Vanilla' }, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85', tag: { ar: 'إصدار محدود', en: 'Limited' }, description: { ar: 'نفحات مخملية تتكشف بهدوء، تجمع الورد الداكن بالمسك والفانيلا الدافئة.', en: 'Velvety notes unfold slowly, blending dark rose with musk and warm vanilla.' } },
  { id: 'diwan', name: { ar: 'ديوان', en: 'Diwan' }, type: { ar: 'عطر يومي راقٍ', en: 'Refined Everyday' }, price: 295, size: '100 ml', note: { ar: 'حمضيات • نيرولي • خشب الصندل', en: 'Citrus • Neroli • Sandalwood' }, image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1000&q=85', tag: { ar: 'أناقة يومية', en: 'Everyday' }, description: { ar: 'انتعاش مضيء يلتقي بخشب الصندل الهادئ، لصياغة حضور يومي أنيق.', en: 'Bright freshness meets calm sandalwood for an effortlessly polished everyday presence.' } },
]

const copy = {
  ar: {
    announcement: 'تجربة عطرية تُصنع لتبقى في الذاكرة',
    navHome: 'الرئيسية', navShop: 'العطور', navStory: 'حكاية وضايا', navContact: 'تواصل معنا',
    eyebrow: 'فن العطر العربي المعاصر', heroTitle: 'ليس مجرد عطر،\\nبل أثرٌ يبقى.', heroText: 'تكوينات عطرية تستلهم روح الصحراء العربية، وتعيد صياغة الفخامة بلمسة عصرية لا تشبه سواها.',
    explore: 'اكتشف المجموعة', ourStory: 'حكاية وضايا', scroll: 'اكتشف عالمنا',
    craftLabel: 'صُنعت بحسّ مختلف', craftTitle: 'الفخامة في التفاصيل.', craftText: 'من أول نفحة إلى آخر أثر، نؤمن أن العطر لغة صامتة تحكي قصتك دون كلمات. مكونات مختارة، وتوازن مدروس، وحضور لا يحتاج إلى إعلان.',
    craftPoints: ['مكونات منتقاة بعناية', 'توقيعات عطرية مميزة', 'تفاصيل مستوحاة من تراثنا'],
    collectionEyebrow: 'توقيعات وضايا', collectionTitle: 'اكتشف مجموعتنا', collectionText: 'أربع شخصيات عطرية، لكل منها حكايتها الخاصة.', viewAll: 'عرض المجموعة',
    add: 'أضف إلى الحقيبة', details: 'التفاصيل', cart: 'حقيبة التسوق', empty: 'حقيبتك فارغة حالياً', emptyText: 'اكتشف عطور وضايا واختر عطرك القادم.', continue: 'استكشف العطور',
    subtotal: 'المجموع', shipping: 'الشحن', shippingText: 'يُحدد عند تأكيد الطلب', checkout: 'اطلب عبر واتساب', remove: 'حذف', totalItems: 'منتجات',
    storyEyebrow: 'روح المكان', storyTitle: 'من رمال الصحراء\\nإلى ذاكرة العطر.', storyText: 'وُلدت وضايا من شغف بالتفاصيل العربية الأصيلة؛ من دفء العود، وهدوء الرمال، وبريق الذهب المطفي. نصنع عطوراً لا تتبع اللحظة، بل تترك بصمتها الخاصة.',
    storyButton: 'تعرّف على عطورنا', quote: 'العطر ذاكرة لا تُرى، لكنها لا تُنسى.',
    newsletterTitle: 'كن أول من يعرف', newsletterText: 'اكتشف الإصدارات الجديدة والحكايات القادمة من عالم وضايا.', newsletterPlaceholder: 'بريدك الإلكتروني', newsletterButton: 'انضم إلينا',
    footerLine: 'عطور تحمل روح المكان، وتترك أثرها في كل مكان.', quickLinks: 'روابط سريعة', follow: 'تابع عالمنا', rights: 'جميع الحقوق محفوظة.',
    back: 'العودة للمتجر', productNotFound: 'لم يتم العثور على المنتج.', notes: 'النفحات العطرية', size: 'الحجم', currency: 'د.إ', qty: 'الكمية',
    whatsappIntro: 'مرحباً وضايا، أرغب في طلب المنتجات التالية:', whatsappName: 'الاسم', whatsappPhone: 'رقم الهاتف', whatsappAddress: 'عنوان التوصيل', customerDetails: 'بيانات الطلب', namePlaceholder: 'الاسم الكامل', phonePlaceholder: '+971...', addressPlaceholder: 'المدينة والمنطقة والعنوان', sendOrder: 'متابعة الطلب عبر واتساب', orderHint: 'سيتم فتح واتساب لإرسال تفاصيل طلبك. لم يتم تحصيل أي مبلغ عبر الموقع.',
    toastAdded: 'أُضيف المنتج إلى الحقيبة', toastLanguage: 'Language switched to English', menu: 'القائمة', close: 'إغلاق', featured: 'مختارة لك'
  },
  en: {
    announcement: 'A fragrance experience made to be remembered',
    navHome: 'Home', navShop: 'Fragrances', navStory: 'Our story', navContact: 'Contact',
    eyebrow: 'The art of modern Arabian perfumery', heroTitle: 'More than a fragrance.\\nAn enduring impression.', heroText: 'Compositions inspired by the spirit of the Arabian desert, redefining luxury with a contemporary signature.',
    explore: 'Explore the collection', ourStory: 'The Wadhaya story', scroll: 'Discover our world',
    craftLabel: 'Crafted with intention', craftTitle: 'Luxury lives in the details.', craftText: 'From the first note to the final trail, we believe fragrance is a silent language that tells your story. Considered ingredients, thoughtful balance and a presence that needs no announcement.',
    craftPoints: ['Thoughtfully selected ingredients', 'Distinctive olfactory signatures', 'Details inspired by our heritage'],
    collectionEyebrow: 'Wadhaya signatures', collectionTitle: 'Discover the collection', collectionText: 'Four fragrance personalities, each with a story of its own.', viewAll: 'View collection',
    add: 'Add to bag', details: 'Discover', cart: 'Your bag', empty: 'Your bag is currently empty', emptyText: 'Explore Wadhaya fragrances and find your next signature.', continue: 'Explore fragrances',
    subtotal: 'Subtotal', shipping: 'Shipping', shippingText: 'Confirmed with your order', checkout: 'Order via WhatsApp', remove: 'Remove', totalItems: 'items',
    storyEyebrow: 'A sense of place', storyTitle: 'From desert sands\\nto the memory of scent.', storyText: 'Wadhaya was born from a devotion to authentic Arabian details: the warmth of oud, the stillness of sand and the glow of matte gold. We create fragrances that go beyond the moment and leave a signature of their own.',
    storyButton: 'Discover our fragrances', quote: 'Fragrance is an unseen memory that never fades.',
    newsletterTitle: 'Be the first to know', newsletterText: 'Discover new releases and stories from the world of Wadhaya.', newsletterPlaceholder: 'Your email address', newsletterButton: 'Join us',
    footerLine: 'Fragrances carrying the spirit of a place, leaving an impression everywhere.', quickLinks: 'Quick links', follow: 'Follow our world', rights: 'All rights reserved.',
    back: 'Back to shop', productNotFound: 'Product not found.', notes: 'Fragrance notes', size: 'Size', currency: 'AED',
    qty: 'Quantity', whatsappIntro: 'Hello Wadhaya, I would like to order the following:', whatsappName: 'Name', whatsappPhone: 'Phone number', whatsappAddress: 'Delivery address', customerDetails: 'Order details', namePlaceholder: 'Full name', phonePlaceholder: '+971...', addressPlaceholder: 'City, area and address', sendOrder: 'Continue order on WhatsApp', orderHint: 'WhatsApp will open with your order details. No payment is collected on this website.',
    toastAdded: 'Added to your bag', toastLanguage: 'تم تغيير اللغة إلى العربية', menu: 'Menu', close: 'Close', featured: 'Curated for you'
  }
}

const money = (amount, lang) => `${amount.toLocaleString(lang === 'ar' ? 'ar-AE' : 'en-AE')} ${lang === 'ar' ? 'د.إ' : 'AED'}`

function App() {
  const [lang, setLang] = useState('ar')
  const [page, setPage] = useState({ name: 'home', id: null })
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [toast, setToast] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const t = copy[lang]
  const isAr = lang === 'ar'
  const dir = isAr ? 'rtl' : 'ltr'
  const selectedProduct = products.find(p => p.id === page.id)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const go = (name, id = null) => {
    setPage({ name, id })
    setCartOpen(false)
    setMobileMenu(false)
    setCheckoutOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id)
      return found ? prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...prev, { ...product, qty: 1 }]
    })
    setToast(t.toastAdded)
    setTimeout(() => setToast(''), 2400)
  }
  const updateQty = (id, delta) => setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0))
  const removeItem = id => setCart(prev => prev.filter(item => item.id !== id))
  const switchLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar')
  const whatsappUrl = useMemo(() => {
    const lines = [
      t.whatsappIntro,
      ...cart.map(item => `• ${item.name[lang]} × ${item.qty} — ${money(item.price * item.qty, lang)}`),
      `${t.subtotal}: ${money(subtotal, lang)}`,
      `${t.whatsappName}: ${customer.name}`,
      `${t.whatsappPhone}: ${customer.phone}`,
      `${t.whatsappAddress}: ${customer.address}`
    ]
    // Replace with your store WhatsApp number in international format, without + or spaces.
    const whatsappNumber = '971508770882'
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
  }, [cart, customer, lang, subtotal, t])

  const ProductCard = ({ product, index = 0 }) => (
    <article className="product-card" style={{ '--delay': `${index * 90}ms` }}>
      <button className="product-image" onClick={() => go('product', product.id)} aria-label={`${t.details} ${product.name[lang]}`}>
        <img src={product.image} alt={product.name[lang]} loading="lazy" />
        <span className="product-tag">{product.tag[lang]}</span>
        <span className="image-arrow"><ArrowDownLeft size={18}/></span>
      </button>
      <div className="product-info">
        <div className="product-heading">
          <div>
            <p className="product-type">{product.type[lang]}</p>
            <button className="product-name" onClick={() => go('product', product.id)}>{product.name[lang]}</button>
          </div>
          <span className="product-price">{money(product.price, lang)}</span>
        </div>
        <p className="product-notes">{product.note[lang]}</p>
        <button className="add-button" onClick={() => addToCart(product)}><span>{t.add}</span><Plus size={16}/></button>
      </div>
    </article>
  )

  return (
    <div className="app" dir={dir}>
      <div className="announcement"><Sparkles size={13}/><span>{t.announcement}</span><Sparkles size={13}/></div>
      <header className="site-header">
        <button className="mobile-menu-toggle icon-button" onClick={() => setMobileMenu(v => !v)} aria-label={t.menu}>{mobileMenu ? <X/> : <Menu/>}</button>
        <nav className={`main-nav ${mobileMenu ? 'open' : ''}`}>
          <button onClick={() => go('home')}>{t.navHome}</button>
          <button onClick={() => go('shop')}>{t.navShop}</button>
          <button onClick={() => go('story')}>{t.navStory}</button>
          <button onClick={() => go('contact')}>{t.navContact}</button>
        </nav>
        <button className="brand" onClick={() => go('home')} aria-label="Wadhaya home">
          <span className="brand-ar">وَضَايَا</span>
          <span className="brand-en">W A D H A Y A</span>
        </button>
        <div className="header-actions">
          <button className="language-button" onClick={switchLang}><Globe2 size={16}/><span>{isAr ? 'EN' : 'عربي'}</span></button>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={t.cart}><ShoppingBag size={19}/><span className="bag-label">{t.cart}</span><span className="bag-count">{cartCount}</span></button>
        </div>
      </header>

      {page.name === 'home' && <main>
        <section className="hero">
          <div className="hero-image" role="img" aria-label="Luxury perfume in a warm desert-inspired setting"/>
          <div className="hero-shade"/>
          <div className="hero-content">
            <p className="eyebrow"><span className="eyebrow-line"/>{t.eyebrow}</p>
            <h1>{t.heroTitle.split('\\n').map((line, i) => <React.Fragment key={line}>{i > 0 && <br/>}{line}</React.Fragment>)}</h1>
            <p className="hero-description">{t.heroText}</p>
            <div className="hero-buttons">
              <button className="button-gold" onClick={() => go('shop')}>{t.explore}<ArrowLeft size={17}/></button>
              <button className="button-text" onClick={() => go('story')}>{t.ourStory}<ArrowDownLeft size={16}/></button>
            </div>
          </div>
          <div className="hero-bottom"><span>01 — 04</span><span className="hero-bottom-line"/><span>{t.scroll}</span></div>
          <div className="hero-vertical">EAU DE PARFUM · UAE</div>
        </section>

        <section className="intro-section section-pad">
          <div className="section-kicker"><span>01</span><span className="kicker-line"/><span>{t.craftLabel}</span></div>
          <div className="intro-grid">
            <h2>{t.craftTitle}</h2>
            <div className="intro-copy"><p>{t.craftText}</p><ul>{t.craftPoints.map(point => <li key={point}><Check size={15}/>{point}</li>)}</ul></div>
          </div>
        </section>

        <section className="collection-section section-pad" id="collection">
          <div className="section-heading">
            <div><p className="small-overline">{t.collectionEyebrow}</p><h2>{t.collectionTitle}</h2><p className="muted">{t.collectionText}</p></div>
            <button className="underlined-link" onClick={() => go('shop')}>{t.viewAll}<ArrowLeft size={16}/></button>
          </div>
          <div className="product-grid">{products.slice(0, 4).map((product, i) => <ProductCard product={product} index={i} key={product.id}/>)}</div>
        </section>

        <section className="story-banner">
          <div className="story-banner-image"/>
          <div className="story-banner-content">
            <p className="small-overline">{t.storyEyebrow}</p>
            <h2>{t.storyTitle.split('\\n').map((line, i) => <React.Fragment key={line}>{i > 0 && <br/>}{line}</React.Fragment>)}</h2>
            <p>{t.storyText}</p>
            <button className="button-outline" onClick={() => go('story')}>{t.storyButton}<ArrowLeft size={17}/></button>
          </div>
          <div className="story-mark">W.</div>
        </section>

        <section className="quote-section"><span className="quote-mark">“</span><p>{t.quote}</p><span className="quote-rule"/></section>
        <Newsletter t={t} lang={lang}/>
      </main>}

      {page.name === 'shop' && <main className="inner-page section-pad">
        <div className="page-intro"><p className="small-overline">{t.collectionEyebrow}</p><h1>{t.collectionTitle}</h1><p>{t.collectionText}</p></div>
        <div className="product-grid shop-grid">{products.map((product, i) => <ProductCard product={product} index={i} key={product.id}/>)}</div>
      </main>}

      {page.name === 'product' && <main className="inner-page section-pad">
        {selectedProduct ? <><button className="back-link" onClick={() => go('shop')}><ArrowRight size={16}/>{t.back}</button><div className="product-detail">
          <div className="detail-image"><img src={selectedProduct.image} alt={selectedProduct.name[lang]}/><span className="detail-stamp">W.</span></div>
          <div className="detail-content"><p className="small-overline">{selectedProduct.type[lang]}</p><h1>{selectedProduct.name[lang]}</h1><p className="detail-price">{money(selectedProduct.price, lang)}</p><p className="detail-description">{selectedProduct.description[lang]}</p><div className="detail-rule"/><div className="detail-meta"><span>{t.size}</span><strong>{selectedProduct.size}</strong></div><div className="detail-meta"><span>{t.notes}</span><strong>{selectedProduct.note[lang]}</strong></div><button className="button-gold detail-add" onClick={() => addToCart(selectedProduct)}>{t.add}<ShoppingBag size={17}/></button></div>
        </div></> : <p>{t.productNotFound}</p>}
      </main>}

      {page.name === 'story' && <main className="inner-page section-pad story-page"><p className="small-overline">{t.storyEyebrow}</p><h1>{t.storyTitle.split('\\n').map((line, i) => <React.Fragment key={line}>{i > 0 && <br/>}{line}</React.Fragment>)}</h1><p className="story-long">{t.storyText}</p><div className="story-values">{t.craftPoints.map((point, i) => <div key={point}><span>0{i+1}</span><h3>{point}</h3></div>)}</div><button className="button-gold" onClick={() => go('shop')}>{t.storyButton}<ArrowLeft size={17}/></button></main>}

      {page.name === 'contact' && <main className="inner-page section-pad contact-page"><p className="small-overline">{t.navContact}</p><h1>{isAr ? 'يسعدنا تواصلك.' : 'We would love to hear from you.'}</h1><p>{isAr ? 'للاستفسارات حول العطور أو الطلبات، تواصل معنا عبر واتساب.' : 'For fragrance and order enquiries, reach us on WhatsApp.'}</p><a className="button-gold link-button" href="https://wa.me/971500000000" target="_blank" rel="noreferrer">{isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}<ArrowLeft size={17}/></a><p className="contact-note">{isAr ? 'يرجى استبدال رقم واتساب التجريبي برقم متجرك قبل الإطلاق.' : 'Please replace the placeholder WhatsApp number with your store number before launch.'}</p></main>}

      <footer className="site-footer" id="contact">
        <div className="footer-main"><div className="footer-brand"><button className="brand footer-logo" onClick={() => go('home')}><span className="brand-ar">وَضَايَا</span><span className="brand-en">W A D H A Y A</span></button><p>{t.footerLine}</p></div><div className="footer-links"><h4>{t.quickLinks}</h4><button onClick={() => go('home')}>{t.navHome}</button><button onClick={() => go('shop')}>{t.navShop}</button><button onClick={() => go('story')}>{t.navStory}</button><button onClick={() => go('contact')}>{t.navContact}</button></div><div className="footer-social"><h4>{t.follow}</h4><a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram <ArrowDownLeft size={14}/></a><a href="https://wa.me/971500000000" target="_blank" rel="noreferrer">WhatsApp <ArrowDownLeft size={14}/></a></div></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Wadhaya. {t.rights}</span><span>MADE WITH INTENTION · UAE</span></div>
      </footer>

      {cartOpen && <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false) }}>
        <aside className="cart-drawer" aria-label={t.cart}>
          <div className="drawer-header"><div><p className="small-overline">WADHAYA</p><h2>{t.cart}<span> ({cartCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label={t.close}><X/></button></div>
          {cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={34}/><h3>{t.empty}</h3><p>{t.emptyText}</p><button className="button-gold" onClick={() => go('shop')}>{t.continue}<ArrowLeft size={16}/></button></div> : <>
            <div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><img src={item.image} alt={item.name[lang]}/><div className="cart-item-info"><h3>{item.name[lang]}</h3><p>{item.size}</p><strong>{money(item.price * item.qty, lang)}</strong><div className="qty-control"><button onClick={() => updateQty(item.id, -1)} aria-label="Decrease"><Minus size={13}/></button><span>{item.qty}</span><button onClick={() => updateQty(item.id, 1)} aria-label="Increase"><Plus size={13}/></button></div></div><button className="remove-item" onClick={() => removeItem(item.id)} aria-label={t.remove}><Trash2 size={16}/></button></div>)}</div>
            <div className="cart-summary"><div><span>{t.subtotal}</span><strong>{money(subtotal, lang)}</strong></div><div><span>{t.shipping}</span><span>{t.shippingText}</span></div><button className="button-gold checkout-button" onClick={() => setCheckoutOpen(true)}>{t.checkout}<ArrowLeft size={17}/></button><p>{t.orderHint}</p></div>
          </>}
        </aside>
      </div>}

      {checkoutOpen && <div className="overlay checkout-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setCheckoutOpen(false) }}><section className="checkout-modal"><div className="drawer-header"><div><p className="small-overline">WADHAYA</p><h2>{t.customerDetails}</h2></div><button className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label={t.close}><X/></button></div><form onSubmit={e => { e.preventDefault(); window.open(whatsappUrl, '_blank', 'noopener,noreferrer') }}><label>{t.whatsappName}<input required value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} placeholder={t.namePlaceholder}/></label><label>{t.whatsappPhone}<input required value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} placeholder={t.phonePlaceholder}/></label><label>{t.whatsappAddress}<textarea required value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} placeholder={t.addressPlaceholder} rows="3"/></label><button className="button-gold checkout-button" type="submit">{t.sendOrder}<ArrowLeft size={17}/></button><p className="form-hint">{t.orderHint}</p></form></section></div>}

      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
      <button className="floating-top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} aria-label="Back to top"><ArrowRight size={17}/></button>
    </div>
  )
}

function Newsletter({ t, lang }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return <section className="newsletter section-pad"><div><p className="small-overline">A NOTE FROM WADHAYA</p><h2>{t.newsletterTitle}</h2><p>{t.newsletterText}</p></div><form onSubmit={e => {e.preventDefault(); setSubmitted(true)}} className="newsletter-form"><input type="email" required value={email} onChange={e => {setEmail(e.target.value); setSubmitted(false)}} placeholder={t.newsletterPlaceholder}/><button type="submit">{submitted ? <Check size={18}/> : t.newsletterButton}</button>{submitted && <span className="newsletter-success">{lang === 'ar' ? 'شكراً لاهتمامك. ربط الاشتراك يحتاج إلى خدمة بريد إلكتروني.' : 'Thank you. Connect an email service to store subscriptions.'}</span>}</form></section>
}

createRoot(document.getElementById('root')).render(<App />)
