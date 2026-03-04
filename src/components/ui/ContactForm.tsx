import { useState, type FormEvent, type ChangeEvent } from 'react';
import axios from 'axios';

interface FormData {
  name: string;
  email: string;
  contact: string;
  company: string;
  content: string;
  agreed: boolean;
}

interface Errors {
  [key: string]: string;
}

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:5000';

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    contact: '',
    company: '',
    content: '',
    agreed: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const validate = (field?: string): boolean => {
    const newErrors: Errors = {};

    if (!field || field === 'name') {
      if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
    }
    if (!field || field === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = '이메일을 입력해주세요.';
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
        newErrors.email = '올바른 이메일 형식을 입력해주세요.';
      }
    }
    if (!field || field === 'contact') {
      if (!formData.contact.trim()) newErrors.contact = '연락처를 입력해주세요.';
    }
    if (!field || field === 'content') {
      if (!formData.content.trim()) newErrors.content = '문의 내용을 입력해주세요.';
    }
    if (!field || field === 'agreed') {
      if (!formData.agreed) newErrors.agreed = '개인정보 수집에 동의해주세요.';
    }

    if (field) {
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] || '' }));
    } else {
      setErrors(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    if (name === 'contact') {
      setFormData((prev) => ({ ...prev, contact: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(field);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, contact: true, content: true, agreed: true });

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/inquiry/send`, {
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        company: formData.company,
        content: formData.content,
      });
      setSubmitResult('success');
      setFormData({ name: '', email: '', contact: '', company: '', content: '', agreed: false });
      setTouched({});
    } catch {
      setSubmitResult('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 0',
    border: 'none',
    borderBottom: '2px solid #eee',
    fontSize: '16px',
    fontFamily: 'inherit',
    outline: 'none',
    background: 'transparent',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 600 as const,
    color: '#999',
    marginBottom: '0.25rem',
    display: 'block',
  };

  const errorStyle = {
    color: '#e74c3c',
    fontSize: '12px',
    marginTop: '0.25rem',
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
      {submitResult === 'success' && (
        <div style={{
          padding: '1rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          color: '#2e7d32',
          fontSize: '14px',
        }}>
          문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.
        </div>
      )}

      {submitResult === 'error' && (
        <div style={{
          padding: '1rem',
          background: '#fbe9e7',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          color: '#c62828',
          fontSize: '14px',
        }}>
          전송에 실패했습니다. 다시 시도해주세요.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>이름 *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            placeholder="이름을 입력하세요"
            style={inputStyle}
          />
          {touched.name && errors.name && <p style={errorStyle}>{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>이메일 *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            placeholder="example@email.com"
            style={inputStyle}
          />
          {touched.email && errors.email && <p style={errorStyle}>{errors.email}</p>}
        </div>

        {/* Contact */}
        <div>
          <label style={labelStyle}>연락처 *</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            onBlur={() => handleBlur('contact')}
            placeholder="010-0000-0000"
            style={inputStyle}
          />
          {touched.contact && errors.contact && <p style={errorStyle}>{errors.contact}</p>}
        </div>

        {/* Company */}
        <div>
          <label style={labelStyle}>회사명</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="회사명을 입력하세요 (선택)"
            style={inputStyle}
          />
        </div>

        {/* Content */}
        <div>
          <label style={labelStyle}>문의 내용 *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            onBlur={() => handleBlur('content')}
            placeholder="문의 내용을 입력하세요"
            rows={5}
            style={{
              ...inputStyle,
              borderBottom: 'none',
              border: '2px solid #eee',
              borderRadius: '8px',
              padding: '1rem',
              resize: 'vertical',
              minHeight: '120px',
            }}
          />
          {touched.content && errors.content && <p style={errorStyle}>{errors.content}</p>}
        </div>

        {/* Agreement */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            name="agreed"
            checked={formData.agreed}
            onChange={handleChange}
            onBlur={() => handleBlur('agreed')}
            id="agree-check"
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="agree-check" style={{ fontSize: '14px', color: '#666', cursor: 'pointer' }}>
            개인정보 수집 및 이용에 동의합니다. *
          </label>
        </div>
        {touched.agreed && errors.agreed && <p style={errorStyle}>{errors.agreed}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '1rem',
            background: isSubmitting ? '#999' : '#091f5b',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease',
            fontFamily: 'inherit',
          }}
        >
          {isSubmitting ? '전송 중...' : '문의하기'}
        </button>
      </div>
    </form>
  );
}
