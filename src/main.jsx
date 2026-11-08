import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownLeft, ArrowLeft, ArrowRight, Check, ChevronDown, Globe2, Menu, Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react'
import './styles.css'
import products from './data/products.json'


const copy = {
  ar: {
    announcement:'وَضَايَا — عطرٌ يُروى… وأثرٌ لا يغيب',
    navHome:'الرئيسية',navShop:'العطور',navDukhoon:'الدخون',navStory:'حكاية وضايا',navContact:'تواصل معنا',
    eyebrow:'دار وضايا للعطور · توقيع من روح الشرق',heroTitle:'حين يصبح العطر\\nحكايةً من ذهب.',heroText:'اكتشف عالماً من التوقيعات العطرية الراقية؛ نفحات تستلهم أصالة الشرق، وتُصاغ بروح معاصرة لترافق حضورك وتترك انطباعاً يليق بك.',
    explore:'اكتشف التوقيعات',ourStory:'حكاية الدار',scroll:'ادخل عالم وضايا',
    craftLabel:'فلسفة وضايا',craftTitle:'أناقةٌ تُدركها الحواس.',craftText:'نؤمن أن الفخامة ليست فيما يُقال، بل فيما يبقى. لذلك نعتني بكل تفصيل؛ من اختيار النفحات وانسجامها، إلى توازن ينساب على البشرة ويترك حولك هالةً لا تُشبه سواك.',
    craftPoints:['نفحات مختارة بذائقة رفيعة','تراكيب متوازنة ذات حضور','إلهام من إرث العطر العربي'],
    collectionEyebrow:'توقيعات الدار',collectionTitle:'عطورٌ تحمل توقيعك',collectionText:'تعرّف إلى اختيارات وضايا؛ لكل عطر طابعه، ولكل حضور حكايته.',viewAll:'استكشف جميع العطور',
    add:'أضف إلى حقيبتك',details:'اكتشف العطر',cart:'حقيبة مشترياتك',empty:'حقيبتك تنتظر اختيارك',emptyText:'تجوّل بين توقيعات وضايا، واعثر على العطر الأقرب إلى ذائقتك.',continue:'استكشف التوقيعات',
    subtotal:'الإجمالي الفرعي',shipping:'التوصيل',shippingText:'تُؤكد التكلفة عند إتمام الطلب',checkout:'أكمل طلبك عبر واتساب',remove:'إزالة',totalItems:'منتجات',
    storyEyebrow:'حكاية الدار',storyTitle:'من روح الشرق\\nتبدأ الحكاية.',storyText:'وُلدت وضايا من تقديرٍ عميق لجمال التفاصيل العربية؛ دفء العود، وسكون الصحراء، ولمعة الذهب. نحول هذا الإلهام إلى عطور تجمع بين أصالة الجذور وأناقة الحاضر، لتمنح كل لحظة توقيعاً خاصاً لا يُنسى.',
    storyButton:'اكتشف عالم العطور',quote:'بعض الحضور يُرى… وحضور العطر يُحسّ ويبقى.',
    footerLine:'وَضَايَا — توقيعات عطرية تستلهم الشرق وتُصاغ لتبقى.',quickLinks:'روابط الدار',follow:'تابع حكايتنا',rights:'جميع الحقوق محفوظة لدار وضايا.',
    back:'العودة إلى العطور',productNotFound:'عذراً، لم نعثر على هذا العطر.',notes:'التكوين العطري',size:'السعة',currency:'د.إ',qty:'الكمية',
    top:'المقدمة',middle:'القلب',base:'القاعدة',family:'العائلة العطرية',
    whatsappIntro:'مرحباً دار وضايا، أود إتمام طلب العطور التالية:',whatsappName:'الاسم',whatsappPhone:'رقم التواصل',whatsappAddress:'عنوان التوصيل',customerDetails:'تفاصيل التوصيل',namePlaceholder:'الاسم الكامل',phonePlaceholder:'+971 50 877 0882',addressPlaceholder:'الإمارة، المنطقة، والعنوان بالتفصيل',sendOrder:'تأكيد التفاصيل عبر واتساب',orderHint:'سيتم تحويلك إلى واتساب لمراجعة تفاصيل طلبك وإرساله. لا تُحصّل أي مدفوعات عبر هذا الموقع.',
    toastAdded:'أُضيف العطر إلى حقيبتك',toastLanguage:'Language switched to English',menu:'القائمة',close:'إغلاق',featured:'اختيار وضايا'
  },
  en: {
    announcement:'WADHAYA — A scent to be remembered. A story to be told.',
    navHome:'Home',navShop:'Fragrances',navDukhoon:'Dukhoon',navStory:'The House',navContact:'Contact',
    eyebrow:'THE HOUSE OF WADHAYA · AN EASTERN SIGNATURE',heroTitle:'Where fragrance\\nbecomes a legacy.',heroText:'Discover an exquisite world of olfactory signatures. Inspired by the soul of the Orient and composed with a contemporary sensibility, each creation is made to accompany your presence and linger beautifully.',
    explore:'Discover the collection',ourStory:'The story of the House',scroll:'Enter the world of Wadhaya',
    craftLabel:'THE WADHAYA PHILOSOPHY',craftTitle:'Elegance, felt beyond words.',craftText:'We believe true luxury is not what is announced, but what remains. Every detail is considered: the selection and harmony of each note, balanced into a graceful composition that leaves an unmistakable aura.',
    craftPoints:['Thoughtfully selected notes','Balanced compositions with presence','Inspired by the heritage of Arabian perfumery'],
    collectionEyebrow:'SIGNATURE CREATIONS',collectionTitle:'Fragrance with a signature.',collectionText:'Explore the Wadhaya selection. Every scent has a character; every presence, a story.',viewAll:'Explore all fragrances',
    add:'Add to your bag',details:'Discover fragrance',cart:'Your shopping bag',empty:'Your bag awaits a signature',emptyText:'Explore the Wadhaya collection and find the fragrance that speaks to your character.',continue:'Explore the collection',
    subtotal:'Subtotal',shipping:'Delivery',shippingText:'Confirmed when your order is placed',checkout:'Complete your order on WhatsApp',remove:'Remove',totalItems:'items',
    storyEyebrow:'THE STORY OF THE HOUSE',storyTitle:'Rooted in the Orient.\\nCreated to linger.',storyText:'Wadhaya was born from a deep appreciation for the beauty of Arabian details: the warmth of oud, the stillness of the desert and the glow of gold. We translate this inspiration into fragrances that unite the authenticity of heritage with the elegance of the present, giving every moment a signature of its own.',
    storyButton:'Discover the fragrances',quote:'Some presences are seen. The presence of fragrance is felt — and remembered.',
    footerLine:'WADHAYA — Olfactory signatures inspired by the Orient, composed to remain.',quickLinks:'Explore',follow:'Follow our story',rights:'All rights reserved by the House of Wadhaya.',
    back:'Back to fragrances',productNotFound:'We could not find this fragrance.',notes:'Olfactive composition',size:'Volume',currency:'AED',qty:'Quantity',
    top:'Top notes',middle:'Heart notes',base:'Base notes',family:'Olfactive family',
    whatsappIntro:'Hello Wadhaya, I would like to place an order for the following fragrances:',whatsappName:'Name',whatsappPhone:'Contact number',whatsappAddress:'Delivery address',customerDetails:'Delivery details',namePlaceholder:'Full name',phonePlaceholder:'+971 50 877 0882',addressPlaceholder:'Emirate, area and full address',sendOrder:'Continue securely on WhatsApp',orderHint:'You will be redirected to WhatsApp to review and send your order. No payment is collected on this website.',
    toastAdded:'Added to your bag',toastLanguage:'تم تغيير اللغة إلى العربية',menu:'Menu',close:'Close',featured:'Wadhaya selection'
  }
}

const money = (amount, lang) => `${amount.toLocaleString(lang === 'ar' ? 'ar-AE' : 'en-AE')} ${lang === 'ar' ? 'د.إ' : 'AED'}`

function NotesBlock({ product, t, lang }) {
  const n = product.notes
  if (!n) return <div className="detail-meta"><span>{t.notes}</span><strong>{product.note[lang]}</strong></div>
  const rows = [['top', t.top], ['middle', t.middle], ['base', t.base]]
  return (
    <div className="notes-block">
      <h3>{t.notes}</h3>
      {rows.map(([key, label]) => (
        <div className="notes-row" key={key}>
          <span>{label}</span>
          <p>{n[key].map(x => <em key={typeof x === 'string' ? x : x.en}>{typeof x === 'string' ? x : x[lang]}</em>)}</p>
        </div>
      ))}
      {n.family && <div className="notes-row"><span>{t.family}</span><p><em>{typeof n.family === 'string' ? n.family : n.family[lang]}</em></p></div>}
    </div>
  )
}

function App() {
  const [catalog, setCatalog] = useState(products)
  useEffect(() => { fetch('/api/products').then(r => r.ok ? r.json() : null).then(data => { if (Array.isArray(data?.products) && data.products.length) setCatalog(data.products) }).catch(() => {}) }, [])
  const [lang, setLang] = useState('ar')
  const [page, setPage] = useState({ name: 'home', id: null })
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [toast, setToast] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewMessage, setReviewMessage] = useState('')
  const [reviewBusy, setReviewBusy] = useState(false)
  const t = copy[lang]
  const isAr = lang === 'ar'
  const dir = isAr ? 'rtl' : 'ltr'
  const selectedProduct = catalog.find(p => p.id === page.id)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const go = (name, id = null) => {
    setPage({ name, id })
    setCartOpen(false)
    setMobileMenu(false)
    setCheckoutOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const submitReview = async (event) => {
    event.preventDefault()
    if (!selectedProduct || !reviewComment.trim()) return
    setReviewBusy(true)
    setReviewMessage('')
    try {
      const response = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ productId: selectedProduct.id, customerName: reviewName, rating: reviewRating, comment: reviewComment }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'تعذر إرسال رأيك')
      setReviewName(''); setReviewRating(5); setReviewComment('')
      setReviewMessage(isAr ? 'شكراً لك، وصل رأيك وسيبقى خاصاً بإدارة المتجر.' : 'Thank you. Your feedback was sent privately to the store owner.')
    } catch (error) { setReviewMessage(error.message || 'تعذر إرسال رأيك') } finally { setReviewBusy(false) }
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
          <span className="product-price">
            {product.oldPrice && <del>{money(product.oldPrice, lang)}</del>}
            <b>{money(product.price, lang)}</b>
            {product.oldPrice && <small className="discount-badge">−{Math.round((1 - product.price / product.oldPrice) * 100)}%</small>}
          </span>
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
          <button onClick={() => go('dukhoon')}>{t.navDukhoon}</button>
          <button onClick={() => go('story')}>{t.navStory}</button>
          <button onClick={() => go('contact')}>{t.navContact}</button>
        </nav>
        <button className="brand" onClick={() => go('home')} aria-label="Wadhaya | وضايا — home">
          <img className="brand-emblem" src="/WD.png" alt="" />
          <span className="brand-wordmark">
            <span className="brand-ar">وَضَايَا</span>
            <span className="brand-en">W A D H A Y A</span>
          </span>
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
          <div className="product-grid">{catalog.slice(0, 4).map((product, i) => <ProductCard product={product} index={i} key={product.id}/>)}</div>
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
      </main>}

      {page.name === 'shop' && <main className="inner-page section-pad">
        <div className="page-intro"><p className="small-overline">{t.collectionEyebrow}</p><h1>{t.collectionTitle}</h1><p>{t.collectionText}</p></div>
        <div className="product-grid shop-grid">{catalog.map((product, i) => <ProductCard product={product} index={i} key={product.id}/>)}</div>
      </main>}

      {page.name === 'dukhoon' && <main className="inner-page section-pad dukhoon-page">
        <div className="page-intro"><p className="small-overline">WADHAYA · TRADITIONAL INCENSE</p><h1>{isAr ? 'مجموعة الدخون' : 'The Dukhoon Collection'}</h1><p>{isAr ? 'اختَر عبقك المفضل من دخون وضايا.' : 'Discover your favourite traditional incense from Wadhaya.'}</p></div>
        <div className="product-grid">{catalog.filter(product => product.category === 'dukhoon').map((product, index) => <ProductCard product={product} index={index} key={product.id}/>)}</div>
      </main>}

      {page.name === 'product' && <main className="inner-page section-pad">
        {selectedProduct ? <><button className="back-link" onClick={() => go('shop')}><ArrowRight size={16}/>{t.back}</button><div className="product-detail">
          <div className="detail-image"><img src={selectedProduct.image} alt={selectedProduct.name[lang]}/><span className="detail-stamp">W.</span></div>
          <div className="detail-content"><p className="small-overline">{selectedProduct.type[lang]}</p><h1>{selectedProduct.name[lang]}</h1><p className="detail-price">{selectedProduct.oldPrice && <del>{money(selectedProduct.oldPrice, lang)}</del>}<b>{money(selectedProduct.price, lang)}</b>{selectedProduct.oldPrice && <small className="discount-badge">−{Math.round((1 - selectedProduct.price / selectedProduct.oldPrice) * 100)}%</small>}</p><p className="detail-description">{selectedProduct.description[lang]}</p><div className="detail-rule"/><div className="detail-meta"><span>{t.size}</span><strong>{selectedProduct.size}</strong></div><NotesBlock product={selectedProduct} t={t} lang={lang}/><button className="button-gold detail-add" onClick={() => addToCart(selectedProduct)}>{t.add}<ShoppingBag size={17}/></button><section className="customer-review-form"><h2>{isAr ? "شاركنا رأيك في المنتج" : "Share your product feedback"}</h2><p>{isAr ? "رأيك يصل إلى إدارة وضايا فقط ولا يظهر للزوار." : "Your feedback is sent privately to Wadhaya management and is not public."}</p><form onSubmit={submitReview}><label>{isAr ? "اسمك (اختياري)" : "Your name (optional)"}<input value={reviewName} maxLength="80" onChange={e=>setReviewName(e.target.value)} /></label><label>{isAr ? "تقييمك" : "Your rating"}<select value={reviewRating} onChange={e=>setReviewRating(Number(e.target.value))}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} / 5</option>)}</select></label><label>{isAr ? "تعليقك" : "Your feedback"}<textarea required maxLength="2000" rows="4" value={reviewComment} onChange={e=>setReviewComment(e.target.value)} placeholder={isAr ? "اكتب رأيك حول العطر أو تجربتك..." : "Tell us about the fragrance or your experience..."}/></label><button className="button-gold" disabled={reviewBusy}>{reviewBusy ? (isAr ? "جارٍ الإرسال..." : "Sending...") : (isAr ? "إرسال رأيي بشكل خاص" : "Send private feedback")}</button>{reviewMessage&&<p role="status">{reviewMessage}</p>}</form></section></div>
        </div></> : <p>{t.productNotFound}</p>}
      </main>}

      {page.name === 'story' && <main className="inner-page section-pad story-page"><p className="small-overline">{t.storyEyebrow}</p><h1>{t.storyTitle.split('\\n').map((line, i) => <React.Fragment key={line}>{i > 0 && <br/>}{line}</React.Fragment>)}</h1><p className="story-long">{t.storyText}</p><div className="story-values">{t.craftPoints.map((point, i) => <div key={point}><span>0{i+1}</span><h3>{point}</h3></div>)}</div><button className="button-gold" onClick={() => go('shop')}>{t.storyButton}<ArrowLeft size={17}/></button></main>}

      {page.name === 'contact' && <main className="inner-page section-pad contact-page"><p className="small-overline">{t.navContact}</p><h1>{isAr ? 'يسعدنا تواصلك.' : 'We would love to hear from you.'}</h1><p>{isAr ? 'للاستفسارات حول العطور أو الطلبات، تواصل معنا عبر واتساب.' : 'For fragrance and order enquiries, reach us on WhatsApp.'}</p><a className="button-gold link-button" href="https://wa.me/971508770882" target="_blank" rel="noreferrer">{isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}<ArrowLeft size={17}/></a></main>}

      <footer className="site-footer" id="contact">
        <div className="footer-main"><div className="footer-brand"><button className="brand footer-logo" onClick={() => go('home')} aria-label="Wadhaya home"><img className="brand-emblem" src="/WD.png" alt="" /><span className="brand-wordmark"><span className="brand-ar">وَضَايَا</span><span className="brand-en">W A D H A Y A</span></span></button><p>{t.footerLine}</p></div><div className="footer-links"><h4>{t.quickLinks}</h4><button onClick={() => go('home')}>{t.navHome}</button><button onClick={() => go('shop')}>{t.navShop}</button><button onClick={() => go('dukhoon')}>{t.navDukhoon}</button><button onClick={() => go('story')}>{t.navStory}</button><button onClick={() => go('contact')}>{t.navContact}</button></div><div className="footer-social"><h4>{t.follow}</h4><a href="https://www.instagram.com/wadhaya.perfume/" target="_blank" rel="noopener noreferrer" aria-label="Wadhaya Perfume on Instagram"><svg className="social-logo" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg><span>Instagram</span><ArrowDownLeft size={14}/></a><a href="https://www.tiktok.com/@wadhaya47" target="_blank" rel="noopener noreferrer" aria-label="Wadhaya Perfume on TikTok"><svg className="social-logo" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a4.2 4.2 0 1 1-3.5-4.14v3.1a1.25 1.25 0 1 0 .5 1V3h3c.4 2.5 1.8 4 4 4.4v3.1A8 8 0 0 1 14 8.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg><span>TikTok</span><ArrowDownLeft size={14}/></a><a href="https://wa.me/971508770882" target="_blank" rel="noopener noreferrer" aria-label="Wadhaya on WhatsApp"><svg className="social-logo" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 8.5c.5 2.5 2 4 4.5 5l1.5-1 2 1c-.4 2-2 2.5-3.5 2-4-1-6-3.5-6.5-6.5-.1-1 1-2 2-1.5Z" fill="currentColor"/></svg><span>WhatsApp</span><ArrowDownLeft size={14}/></a></div></div>
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

createRoot(document.getElementById('root')).render(<App />)
