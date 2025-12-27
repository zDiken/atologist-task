"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import styles from '@/app/signup.module.scss';
import { setAuthState } from '@/app/lib/auth';
import atologistLogo from '@/public/images/atologist-logo.svg';
import signupImage from '@/public/images/Signup-Image.png'
import ChateIcon from '@/public/images/Chate.svg'

async function hashPassword(password) {
  const enc = new TextEncoder();
  const data = await crypto.subtle.digest('SHA-256', enc.encode(password));
  return Array.from(new Uint8Array(data)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '', mobile: '', dob: '', agreeTos: false, agreePrivacy: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleGoogleSuccess = async (codeResponse) => {
    setLoading(true);
    try {
      // Exchange code for token (backend would do this)
      const { data: userData } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${codeResponse.access_token}` },
      });

      // Save auth state with Google data
      setAuthState({
        firstname: userData.given_name || userData.name || '',
        lastname: userData.family_name || '',
        email: userData.email || '',
        mobile: '',
        loginMethod: 'google',
      });

      setMessage({ type: 'success', text: 'Signup with Google successful!' });
      setTimeout(() => {
        try { router.push('/welcome') } catch (e) { /* ignore */ }
      }, 600);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Google signup failed' });
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setMessage({ type: 'error', text: 'Google login failed' }),
  });

  function validate() {
    const e = {};
    if (!form.firstname.trim()) e.firstname = 'First name is required';
    if (!form.lastname.trim()) e.lastname = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email is invalid';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.mobile.trim()) e.mobile = 'Mobile is required';
    else if (!/^\d{7,15}$/.test(form.mobile.replace(/\s|\-|\(|\)/g, ''))) e.mobile = 'Mobile must be 7-15 digits';
    if (!form.dob) e.dob = 'Date of birth is required';
    if (!form.agreeTos) e.agreeTos = 'You must agree to Terms of Service';
    if (!form.agreePrivacy) e.agreePrivacy = 'You must agree to Privacy Policy';
    return e;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setMessage(null);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      const encryptpassword = await hashPassword(form.password);

      const payload = {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        encryptpassword,
        mobile: form.mobile.trim(),
        dob: form.dob,
      };

      const { data } = await axios.post('https://atologistinfotech.com/api/register.php', payload);
      setMessage({ type: 'success', text: (data && data.message) || 'Signup successful' });
      // Save auth state
      setAuthState({
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
      });
      setForm({ firstname: '', lastname: '', email: '', password: '', mobile: '', dob: '', agreeTos: false, agreePrivacy: false });
      setErrors({});
      // short delay to show success message then redirect
      setTimeout(() => {
        try { router.push('/welcome') } catch (e) { /* ignore */ }
      }, 900);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.content}>
          <aside>
            <header className={styles.header}>
              <div className={styles.logoWrap}>
                <Image src={atologistLogo} alt="Atologist" width={140} height={36} />
              </div>
              <div className={styles.signinLink}>
                Already have an account? <a href="#">Sign In</a>
              </div>
            </header>
            <div className={styles.left}>
              <div className={styles.welcome}>
                <h2>Welcome To Atologist Infotech</h2>
                <p>Create your account</p>
              </div>

              <button type="button" className={styles.googleBtn} onClick={() => googleLogin()} disabled={loading} aria-label="Sign up with Google">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.6 12.2275c0-.746-.0675-1.4835-.1975-2.199H12v4.166h5.48c-.236 1.266-.95 2.343-2.028 3.06v2.548h3.28c1.92-1.7675 3.04-4.378 3.04-7.5755z" fill="#4285F4" /><path d="M12 22c2.7 0 4.966-.9 6.62-2.44l-3.28-2.548c-.91.6125-2.07.976-3.34.976-2.56 0-4.732-1.72-5.505-4.03H3.02v2.53C4.66 19.79 8.06 22 12 22z" fill="#34A853" /><path d="M6.495 13.958c-.205-.62-.322-1.28-.322-1.958 0-.678.117-1.338.322-1.958V7.492H3.02C2.27 8.94 1.8 10.43 1.8 12c0 1.57.47 3.06 1.22 4.508l3.475-2.55z" fill="#FBBC05" /><path d="M12 4.48c1.47 0 2.78.505 3.82 1.496l2.87-2.87C16.96 1.54 14.7 1 12 1 8.06 1 4.66 3.21 3.02 6.48l3.475 2.53C7.268 6.2 9.44 4.48 12 4.48z" fill="#EA4335" /></svg>
                <span>{loading ? 'Signing up...' : 'Sign up with Google'}</span>
              </button>

              <div className={styles.orDivider}><span>OR</span></div>

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.row}>
                  <label className={styles.field}>
                    <span>First Name</span>
                    <input placeholder="Enter your first name" value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })} />
                    {errors.firstname && <small className={styles.error}>{errors.firstname}</small>}
                  </label>
                  <label className={styles.field}>
                    <span>Last Name</span>
                    <input placeholder="Enter your last name" value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })} />
                    {errors.lastname && <small className={styles.error}>{errors.lastname}</small>}
                  </label>
                </div>

                <label className={styles.field}>
                  <span>Email</span>
                  <input type="email" placeholder="Enter your email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  {errors.email && <small className={styles.error}>{errors.email}</small>}
                </label>

                <label className={styles.field}>
                  <span>Mobile</span>
                  <input placeholder="Enter your mobile number" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
                  {errors.mobile && <small className={styles.error}>{errors.mobile}</small>}
                </label>

                <label className={styles.field}>
                  <span>Password</span>
                  <input type="password" placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  {errors.password && <small className={styles.error}>{errors.password}</small>}
                </label>

                <label className={styles.field}>
                  <span>DOB</span>
                  <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                  {errors.dob && <small className={styles.error}>{errors.dob}</small>}
                </label>

                <div className={styles.agree}>
                  <h3>I agree to </h3>
                  <div className={styles.checks}>
                    <label><input type="checkbox" checked={form.agreeTos} onChange={e => setForm({ ...form, agreeTos: e.target.checked })} /> Terms of Service</label>
                    <label><input type="checkbox" checked={form.agreePrivacy} onChange={e => setForm({ ...form, agreePrivacy: e.target.checked })} /> Privacy Policy</label>
                  </div>
                  <p>
                    {errors.agreeTos && <small className={styles.error}>{errors.agreeTos}</small>}
                  </p>
                  <p>
                    {errors.agreePrivacy && <small className={styles.error}>{errors.agreePrivacy}</small>}
                  </p>
                </div>

                <button className={styles.createBtn} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>

                {message && (
                  <div className={message.type === 'error' ? styles.msgError : styles.msgSuccess} role="status">
                    {message.text}
                  </div>
                )}
              </form>
            </div>
          </aside>

          <aside className={styles.right}>
            <Image src={signupImage} alt="Signup vector" />
          </aside>

          <div className={styles.chateIcon}>
            <Image src={ChateIcon} alt="chate-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
