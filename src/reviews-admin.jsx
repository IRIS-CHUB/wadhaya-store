import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { LogOut, RefreshCw } from 'lucide-react'
import './styles.css'
import './admin.css'
function ReviewsAdmin(){
 const [mode,setMode]=useState('loading'),[email,setEmail]=useState(''),[reviews,setReviews]=useState([]),[message,setMessage]=useState('')
 async function load(){const r=await fetch('/api/admin/reviews',{credentials:'same-origin'}),d=await r.json();if(!r.ok)throw Error(d.error||'تعذر تحميل الآراء');setReviews(d.reviews||[])}
 async function check(){try{const r=await fetch('/api/auth/me',{credentials:'same-origin'});if(!r.ok){setMode('login');return}const d=await r.json();setEmail(d.admin.email);await load();setMode('dashboard')}catch(e){setMessage(e.message||'تعذر الاتصال');setMode('login')}}
 useEffect(()=>{check()},[])
 async function logout(){await fetch('/api/auth/logout',{method:'POST',credentials:'same-origin'});location.href='/admin.html'}
 const date=v=>new Date(Number(v)*1000).toLocaleString('ar-AE')
 if(mode==='loading')return <main className="admin-shell"><div className="admin-card">جارٍ التحقق من الجلسة...</div></main>
 if(mode!=='dashboard')return <main className="admin-shell"><section className="admin-card"><h1>يلزم تسجيل دخول المدير</h1><p>سجّل الدخول أولاً لعرض آراء الزبائن الخاصة.</p><a className="admin-back" href="/admin.html">الانتقال إلى لوحة المدير</a></section></main>
 return <main className="admin-shell admin-dashboard" dir="rtl"><header className="admin-topbar"><div className="admin-brand"><span className="admin-mark">و</span><span>وَضَايَا<small>WADHAYA ADMIN</small></span></div><div className="admin-user"><span>{email}</span><button onClick={logout}><LogOut size={16}/> خروج</button></div></header><div className="admin-layout"><aside className="admin-sidebar"><p className="admin-kicker">مساحة العمل</p><a className="admin-back" href="/admin.html">إدارة المنتجات ↗</a><a className="admin-back" href="/">عرض المتجر ↗</a></aside><section className="admin-content"><div className="admin-heading"><div><p className="admin-kicker">ملاحظات العملاء · خاصة</p><h1>آراء الزبائن على المنتجات</h1><p className="admin-muted">هذه التعليقات لا تظهر في واجهة المتجر أو للزبائن الآخرين.</p></div><button className="admin-primary" onClick={()=>load().catch(e=>setMessage(e.message))}><RefreshCw size={16}/> تحديث</button></div><div className="admin-stats"><div><span>إجمالي الآراء</span><strong>{reviews.length}</strong></div><div><span>متوسط التقييم</span><strong>{reviews.length?(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1):'—'} / 5</strong></div><div><span>الخصوصية</span><strong>للمدير فقط</strong></div></div>{message&&<p className="admin-message admin-notice">{message}</p>}<div className="admin-product-list">{reviews.map(r=><article className="admin-product-row" key={r.id}><div className="admin-product-info"><strong>{r.product_name} <small>· {r.customer_name}</small></strong><span>{date(r.created_at)}</span><b>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</b><p style={{color:'#e7c98e',fontSize:12,lineHeight:2,whiteSpace:'pre-wrap'}}>{r.comment}</p></div></article>)}{!reviews.length&&<p className="admin-empty">لا توجد آراء حتى الآن.</p>}</div></section></div></main>
}
createRoot(document.getElementById('reviews-admin-root')).render(<ReviewsAdmin />)
