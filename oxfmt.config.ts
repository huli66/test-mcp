import {defineConfig} from 'oxfmt';

export default defineConfig({
  // 每行最大宽度，oxfmt 会尽量在接近这个宽度时换行
  printWidth: 100,
  // 每一级缩进使用 2 个空格
  tabWidth: 2,
  // 是否使用 tab 缩进；false 表示使用空格
  useTabs: false,
  // 语句末尾是否加分号；false 表示不主动加分号
  semi: true,
  // JS/TS 字符串是否优先使用单引号
  singleQuote: true,
  // JSX/TSX 是否优先使用单引号
  jsxSingleQuote: true,
  // 对象属性什么时候加引号；as-needed 表示只有必要时才加
  quoteProps: 'as-needed',
  // 多行对象、数组、参数等末尾是否加逗号；none 表示不加尾逗号
  trailingComma: 'none',
  // 对象字面量大括号内是否加空格；true 表示 { foo: bar }
  bracketSpacing: false,
  // 多行 HTML/Vue/JSX 标签的 > 是否跟最后一个属性放同一行；false 表示单独换行
  bracketSameLine: false,
  // 箭头函数单个参数是否加括号；always 表示 (x) => x
  arrowParens: 'always',
  // 文件换行符；lf 表示使用 Unix 风格换行，避免跨平台 diff 抖动
  endOfLine: 'lf',
  // HTML/Vue 中空白是否敏感；css 表示按 CSS display 规则判断
  htmlWhitespaceSensitivity: 'css',
  // HTML/Vue/JSX 多属性标签是否强制一行一个属性
  singleAttributePerLine: false,
  // Markdown 文本是否自动换行；preserve 表示保留原来的换行
  proseWrap: 'preserve',
  // 文件末尾插入换行符
  insertFinalNewline: true,

  // 启用 import 自动排序，并显式定义各类 import 的排列方式
  sortImports: {
    // 定义 import 分组以及各分组的先后顺序
    groups: [
      'type-import', // 类型导入优先放在最前面
      ['value-builtin', 'value-external'], // Node.js 内置模块和第三方依赖放在一起
      'type-internal', // 使用 @/ 别名的类型导入
      'value-internal', // 使用 @/ 别名的普通值导入
      ['type-parent', 'type-sibling', 'type-index'], // 相对路径的类型导入
      ['value-parent', 'value-sibling', 'value-index'], // 相对路径的普通值导入
      'style', // CSS、Less 等样式导入
      'unknown' // 无法识别类型的导入作为兜底放在最后
    ],
    // 将项目使用的 @/ 路径识别为内部模块
    internalPattern: ['@/'],
    // 每个分组内部按照模块名称升序排列
    order: 'asc',
    // 排序比较时忽略模块名称的大小写差异
    ignoreCase: true,
    // 不同 import 分组之间插入空行
    newlinesBetween: false,
    // 普通注释不阻止 import 跨注释重新分组
    partitionByComment: false,
    // 已有空行不阻止 import 重新分组
    partitionByNewline: false,
    // 不调整纯副作用导入顺序，避免改变模块初始化行为
    sortSideEffects: false
  },
  // 是否自动排序 Tailwind class；如果不用 Tailwind，保持 false
  sortTailwindcss: true,
  // 是否自动排序 package.json；oxfmt 默认通常是开启的，这里显式写出来方便团队知道
  sortPackageJson: true,
  // 忽略不需要格式化的目录或文件
  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    'public/**',
    'coverage/**',
    'build/**',
    'docs/**',
    'scripts/**',
    'tests/**',
    // 忽略自动生成的组件类型声明，避免生成器反复覆盖格式化结果
    'components.d.ts',
    // 忽略自动生成的 API 类型声明，避免产生无意义的格式差异
    'auto-imports.d.ts'
  ]
});
