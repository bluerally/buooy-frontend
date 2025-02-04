/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        pre: ['Pretendard'],
      },
      flexGrow: {
        2: '2',
      },
      colors: {
        /** sky */
        'b-20': '#F2F5FF',
        'b-50': '#E5EAFF',
        'b-100': '#CFD7FF',
        'b-150': '#8C9BFF',
        'b-200': '#647EFF',
        'b-300': '#3C3CFF',
        'b-400': '#2D2DC8',
        //
        'b-500': '#476CFF',
        'b-600': '#3958D2',
        'b-700': '#2B43A5',
        'b-800': '#1C2F78',
        'b-900': '#0E1A4B',
        'b-950': '#071035',

        'g-0': '#fff',
        'g-50': '#FAFAFA',
        'g-100': '#F5F5F5',
        'g-150': '#F0F0F0',
        'g-200': '#ECECEC',
        'g-300': '#D4D4D4',
        'g-400': '#737373',
        'g-500': '#5c5c5c',
        'g-600': '#474747',
        'g-700': '#3f3f46',
        'g-800': '#27272a',
        'g-900': '#0A0A0A',
        'g-950': '#09090b',

        /** error */
        'error-50': '#FEF2F2',
        'error-100': '#FEE2E2',
        'error-150': '#FECACA',
        'error-200': '#EF4444',
        'error-300': '#D51E1E',
        'error-400': '#B91C1C',
        success: '#2db362',
        warning: '#ffc750',
        kakao: '#FEE500',
        naver: '#03C75A',
      },
      width: {
        56: '56px',
        68: '68px',
        100: '100px',
        108: '108px',
        390: '390px',
        420: '420px',
        812: '812px',
      },
    },
    fontSize: {
      basic: ['12px', { lineHeight: '18px' }],
      sm: ['10px', { lineHeight: '15px' }],
      'sm-2': ['11px', { lineHeight: '17px' }],
      'basic-2': ['13px', { lineHeight: '19.5px' }],
      md: ['14px', { lineHeight: '21px' }],
      'md-2': ['15px', { lineHeight: '22.5px' }],
      lg: ['16px', { lineHeight: '24px' }],
      xl: ['18px', { lineHeight: '27px' }],
      '2xl': ['20px', { lineHeight: '30px' }],
      '3xl': ['22px', { lineHeight: '33px' }],
      '4xl': ['24px', { lineHeight: '36px' }],
      '5xl': ['26px', { lineHeight: '39px' }],
      '6xl': ['32px', { lineHeight: '48px' }],
      '7xl': ['40px', { lineHeight: '48px' }],
    },
  },
  plugins: [],
};
