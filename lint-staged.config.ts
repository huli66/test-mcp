import type {Configuration} from 'lint-staged';

// 为 lint-staged 提供类型检查和编辑器补全
const config: Configuration = {
  // 对所有已暂存文件依次执行任务；工具会自行跳过不支持或已忽略的文件
  '*': [
    // 先按项目 Oxfmt 配置格式化，并写回已暂存文件
    // 'oxfmt --write --no-error-on-unmatched-pattern',
    // 再应用 Oxlint 的安全修复；无法修复的错误或警告会阻止提交
    'oxlint --fix --no-error-on-unmatched-pattern',
    // 最后重新格式化，避免 Oxlint 修复产生不符合 Oxfmt 的排版
    'oxfmt --write --no-error-on-unmatched-pattern'
  ]
};

export default config;
