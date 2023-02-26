module.exports = {
	extends: ["@commitlint/config-conventional"],
	defaultIgnores: true,
// 	// rules: {},
// 	// prompt: {
// 	// 	messages: {
// 	// 		skip: ":skip",
// 	// 		max: "upper %d chars",
// 	// 		min: "%d chars at least",
// 	// 		emptyWarning: "can not be empty",
// 	// 		upperLimitWarning: "over limit",
// 	// 		lowerLimitWarning: "below limit",
// 	// 	},
// 	// 	questions: {
// 	// 		type: {
// 	// 			description: "选择你要提交的类型:",
// 	// 			enum: {
// 	// 				feat: {
// 	// 					title: "特性",
// 	// 					description: "特性:   🚀  新增功能",
// 	// 					emoji: "🚀",
// 	// 				},
// 	// 				fix: {
// 	// 					title: "修复",
// 	// 					description: "修复:   🧩  修复缺陷",
// 	// 					emoji: "🧩",
// 	// 				},
// 	// 				docs: {
// 	// 					title: "文档",
// 	// 					description: "文档:   📚  文档变更",
// 	// 					emoji: "📚",
// 	// 				},
// 	// 				style: {
// 	// 					title: "格式",
// 	// 					description:
// 	// 						"格式:   🎨  代码格式（不影响功能，例如空格、分号等格式修正）",
// 	// 					emoji: "🎨",
// 	// 				},
// 	// 				refactor: {
// 	// 					title: "重构",
// 	// 					description:
// 	// 						"重构:   ♻️  代码重构（不包括 bug 修复、功能新增）",
// 	// 					emoji: "♻️",
// 	// 				},
// 	// 				perf: {
// 	// 					title: "性能",
// 	// 					description: "性能:   ⚡️  性能优化",
// 	// 					emoji: "⚡️",
// 	// 				},
// 	// 				test: {
// 	// 					title: "测试",
// 	// 					description: "测试:   ✅  添加疏漏测试或已有测试改动",
// 	// 					emoji: "✅",
// 	// 				},
// 	// 				build: {
// 	// 					title: "构建",
// 	// 					description:
// 	// 						"构建:   📦️  构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）",
// 	// 					emoji: "📦️",
// 	// 				},
// 	// 				ci: {
// 	// 					title: "集成",
// 	// 					description: "集成:   🎡  修改 CI 配置、脚本",
// 	// 					emoji: "🎡",
// 	// 				},
// 	// 				revert: {
// 	// 					title: "回退",
// 	// 					description: "回退:   ⏪️  回滚 commit",
// 	// 					emoji: "⏪️",
// 	// 				},
// 	// 				other: {
// 	// 					title: "其他",
// 	// 					description:
// 	// 						"其他:   🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）",
// 	// 					emoji: "🔨",
// 	// 				},
// 	// 			},
// 	// 		},
// 	// 		scope: {
// 	// 			description: "选择一个提交范围(可选):",
// 	// 			enum: {
// 	// 				string: { title: "字符串工具" },
// 	// 				object: { title: "对象工具" },
// 	// 				func: { title: "函数工具" },
// 	// 				events: { title: "事件工具" },
// 	// 				collection: { title: "数据容器" },
// 	// 				classs: { title: "类工具" },
// 	// 				tree: { title: "树工具" },
// 	// 				typecheck: { title: "类型判断" },
// 	// 				misc: { title: "杂项" },
// 	// 			},
// 	// 		},
// 	// 		subject: {
// 	// 			description: "填写简短精炼的变更描述 :\n",
// 	// 		},
// 	// 		body: {
// 	// 			description:
// 	// 				'填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
// 	// 		},
// 	// 		breaking: {
// 	// 			description:
// 	// 				'列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
// 	// 		},
// 	// 		issues: {
// 	// 			description: "选择关联issue(可选):",
// 	// 		},
// 	// 		footer: {
// 	// 			description: "列举关联issue (可选) 例如: #31, #I3244 :\n",
// 	// 		},
// 	// 	},
// 	// },
// };
// 