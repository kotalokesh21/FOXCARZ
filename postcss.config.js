import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import tailwindNesting from '@tailwindcss/nesting'

export default {
  plugins: [
    postcssImport,
    tailwindNesting,
    tailwindcss('./tailwind.config.ts'),
    autoprefixer,
  ],
}
