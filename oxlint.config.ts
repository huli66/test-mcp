import {defineConfig} from 'oxlint'; // 引入 oxlint 的类型化配置辅助函数
export default defineConfig({
  // 导出 oxlint 配置对象
  ignorePatterns: [
    // 配置不需要 lint 的文件和目录
    'node_modules/**', // 忽略依赖目录
    'dist/**', // 忽略 Vite/Rollup 常见构建输出
    'build/**', // 忽略 React/CRA 等常见构建输出
    '.next/**', // 忽略 Next.js 构建缓存
    '.nuxt/**', // 忽略 Nuxt 构建缓存
    '.output/**', // 忽略 Nuxt/Nitro 输出目录
    'coverage/**', // 忽略测试覆盖率目录
    'storybook-static/**', // 忽略 Storybook 静态构建目录
    'public/**', // 忽略静态资源目录
    'generated/**', // 忽略生成代码目录
    '**/*.min.js', // 忽略压缩后的 JS 文件
    '**/*.d.ts' // 忽略类型声明文件
  ], // 结束忽略列表
  env: {
    // 配置全局运行环境
    browser: true, // 启用浏览器环境全局变量
    node: true, // 启用 Node.js 环境全局变量
    es2024: true // 启用较新的 ECMAScript 全局能力
  }, // 结束环境配置
  plugins: [
    // 启用 oxlint 内置插件
    'typescript', // 启用 TypeScript 相关规则
    'react', // 启用 React/JSX 相关规则
    'jsx-a11y', // 启用 JSX 可访问性规则
    'vue', // 启用 Vue 相关规则
    'import', // 启用 import/export 相关规则
    'promise', // 启用 Promise 相关规则
    'node', // 启用 Node.js 相关规则
    'vitest' // 启用 Vitest 测试相关规则
  ], // 结束插件列表
  categories: {
    // 配置规则分类的默认严格程度
    correctness: 'error', // 正确性问题直接报错
    suspicious: 'warn', // 可疑代码先警告
    perf: 'warn', // 性能相关问题先警告
    style: 'off', // 风格问题交给 oxfmt
    pedantic: 'off', // 过度严格规则默认关闭
    restriction: 'off', // 限制性规则默认关闭
    nursery: 'off' // 实验性规则默认关闭
  }, // 结束分类配置
  settings: {
    // 配置插件共享设置
    react: {
      // 配置 React 插件行为
      linkComponents: [
        // 告诉规则哪些组件等价于链接
        {name: 'Link', attribute: 'to'}, // React Router / Vue Router 风格 Link
        {name: 'NavLink', attribute: 'to'} // React Router NavLink
      ] // 结束链接组件配置
    }, // 结束 React 设置
    'jsx-a11y': {
      // 配置 JSX 可访问性插件
      components: {
        // 把自定义组件映射成原生元素
        Link: 'a', // Link 组件按 a 标签检查
        NavLink: 'a', // NavLink 组件按 a 标签检查
        Button: 'button' // Button 组件按 button 标签检查
      } // 结束组件映射
    } // 结束 jsx-a11y 设置
  }, // 结束插件设置
  globals: {
    // 配置额外全局变量
    defineProps: 'readonly', // Vue defineProps 宏是只读全局
    defineEmits: 'readonly', // Vue defineEmits 宏是只读全局
    defineExpose: 'readonly', // Vue defineExpose 宏是只读全局
    defineOptions: 'readonly', // Vue defineOptions 宏是只读全局
    defineSlots: 'readonly', // Vue defineSlots 宏是只读全局
    withDefaults: 'readonly' // Vue withDefaults 宏是只读全局
  }, // 结束全局变量配置
  rules: {
    // 配置单条规则
    'eslint/no-debugger': 'error', // 禁止 debugger 遗留到代码里
    'eslint/no-alert': 'warn', // 不建议使用 alert/confirm/prompt
    'eslint/no-console': 'off', // 业务代码里 console 先警告
    'eslint/no-var': 'error', // 禁止 var
    'eslint/no-unused-vars': 'warn', // 警告未使用的变量
    'eslint/prefer-const': 'warn', // 能用 const 时提示使用 const
    'eslint/eqeqeq': 'warn', // 建议使用 === 和 !==
    'eslint/no-underscore-dangle': 'off', // 警告下划线命名的变量
    'typescript/no-explicit-any': 'off', // 允许 any，避免业务开发太束手束脚
    'typescript/no-empty-object-type': 'off', // 允许空对象类型，兼容常见泛型写法
    'typescript/no-non-null-assertion': 'warn', // 非空断言允许但警告
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要手动 import React
    'promise/always-return': 'off', // 允许 then 回调只执行副作用，不强制返回值或抛出异常
    'eslint/sort-imports': 'off', // import 排序统一交给 oxfmt，避免两个工具重复处理
    'import/no-unassigned-import': [
      'warn', // 非样式的裸导入继续警告，避免误引入无用或有隐式副作用的模块
      {
        allow: ['**/*.css'] // 允许 CSS 通过裸 import 加载，包括相对路径、别名和依赖包样式
      }
    ]
  }, // 结束规则配置
  overrides: [
    // 针对不同文件覆盖规则
    {
      // 配置构建脚本和工具配置文件
      files: [
        '**/*.config.{js,cjs,mjs,ts,mts,cts}',
        '**/vite.config.*',
        '**/vitest.config.*',
        '**/playwright.config.*',
        '**/oxlint.config.*'
      ], // 匹配配置类文件
      env: {browser: false, node: true}, // 配置文件主要运行在 Node.js
      rules: {'eslint/no-console': 'off'} // 配置文件允许 console
    }, // 结束配置文件覆盖
    {
      // 配置测试文件
      files: ['**/*.{test,spec}.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'], // 匹配测试文件
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly'
      }, // 配置 Vitest/Jest 常用测试全局变量
      rules: {'eslint/no-console': 'off', 'typescript/no-explicit-any': 'off'} // 测试文件放宽 console 和 any
    } // 结束测试文件覆盖
  ], // 结束覆盖配置
  options: {
    // 配置 oxlint 运行选项
    typeAware: false, // 默认不启用类型感知，保持速度
    maxWarnings: 0 // CI 中有 warning 也返回失败，逼自己及时处理
  } // 结束运行选项
}); // 结束 defineConfig
