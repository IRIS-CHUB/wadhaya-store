import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { KeyRound, ShieldCheck, LogOut, LockKeyhole } from 'lucide-react'
import './styles.css'
import './admin.css'

function AdminApp() {
  const [mode, setMode] = useState('loading')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [setupToken, setSetupToken] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function checkSession() {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'same-origin' })
      if (response.ok) {
        const data = await response.json()
        setEmail(data.admin.email)
        setMode('dashboard')
      } else {
        setMode('login')
      }
    } catch {
      setMessage('تعذر الاتصال بالخادم. تحقق من إعدادات Cloudflare.')
      setMode('login')
    }
  }

  useEffect(() => { checkSession() }, [])

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    const endpoint = mode === 'setup' ? '/api/auth/setup' : '/api/auth/login'
    const payload = mode === 'setup' ? { email, password, setupToken } : { email, password }
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'تعذر تسجيل الدخول.')
      setPassword('')
      setSetupToken('')
      await checkSession()
    } catch (error) {
      setMessage(error.message || 'حدث خطأ غير متوقع.')
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    setMode('login')
    setPassword('')
    setMessage('تم تسجيل الخروج بأمان.')
  }

  if (mode === 'loading') return <main className="admin-shell"><div className="admin-card">جارٍ التحقق من الجلسة...</div></main>

  return (
    <main className="admin-shell" dir="rtl">
      <div className="admin-brand"><span className="admin-mark">و</span><span>وَضَايَا<small>WADHAYA ADMIN</small></span></div>
      {mode === 'dashboard' ? (
        <section className="admin-card">
          <ShieldCheck size={34} />
          <p className="admin-kicker">لوحة الإدارة</p>
          <h1>مرحباً بك في وضايا</h1>
          <p className="admin-muted">تم التحقق من هويتك بنجاح.</p>
          <div className="admin-account">{email}</div>
          <p className="admin-muted">تم تجهيز جلسة المدير. ستُضاف أدوات إدارة المنتجات في المرحلة التالية.</p>
          <button className="admin-submit" onClick={logout}><LogOut size={16} /> تسجيل الخروج</button>
        </section>
      ) : (
        <section className="admin-card">
          <LockKeyhole size={34} />
          <p className="admin-kicker">منطقة محمية</p>
          <h1>{mode === 'setup' ? 'إعداد حساب المدير' : 'تسجيل دخول المدير'}</h1>
          <p className="admin-muted">هذه الصفحة مخصصة لإدارة متجر وضايا فقط.</p>
          <form onSubmit={submit}>
            <label>البريد الإلكتروني<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label>
            <label>كلمة المرور<input type="password" autoComplete={mode === 'setup' ? 'new-password' : 'current-password'} minLength={mode === 'setup' ? 12 : 1} required value={password} onChange={e => setPassword(e.target.value)} /></label>
            {mode === 'setup' && <label>رمز الإعداد لمرة واحدة<input type="password" required value={setupToken} onChange={e => setSetupToken(e.target.value)} /></label>}
            <button className="admin-submit" disabled={busy}>{busy ? 'يرجى الانتظار...' : mode === 'setup' ? 'إنشاء حساب المدير' : 'دخول آمن'} <KeyRound size={16} /></button>
          </form>
          {message && <p className="admin-message" role="status">{message}</p>}
          {mode === 'login' && <button className="admin-switch" onClick={() => { setMode('setup'); setMessage('يُستخدم هذا الخيار مرة واحدة فقط لإنشاء أول حساب مدير.') }}>إعداد أول حساب مدير</button>}
          {mode === 'setup' && <button className="admin-switch" onClick={() => { setMode('login'); setMessage('') }}>العودة لتسجيل الدخول</button>}
        </section>
      )}
      <a className="admin-back" href="/">العودة إلى المتجر</a>
      <p className="admin-foot">WADHAYA · SECURE ADMIN ACCESS</p>
    </main>
  )
}

createRoot(document.getElementById('admin-root')).render(<AdminApp />)
