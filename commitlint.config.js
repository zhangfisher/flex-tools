module.exports = {
	extends: ["@commitlint/config-conventional"],
	defaultIgnores: false,
	rules: {},
	prompt: {
        settings:{
            enableMultipleScopes:true,
            "scope-enum":[1,"always",[
                "string",
                "object",
                "func",
                "events",
                "collection",
                "tree",
                "typecheck",
                "misc",
                "other"
            ]]
        },
		messages: {
			skip: "跳过",
			max: "最大支持%d个字符",
			min: "不能少于%d个字符",
			emptyWarning: "不能为空",
			upperLimitWarning: "over limit",
			lowerLimitWarning: "below limit",
		},
		questions: {
			type: {
				description: "选择你要提交的类型:",
				enum: {
					feat: {
						title: "特性",
						description: "   🚀  新增功能",
						emoji: "🚀",
					},
					fix: {
						title: "修复",
						description: "   🐛  修复缺陷",
						emoji: "🐛",
					},
					docs: {
						title: "文档",
						description: "   📚  文档变更",
						emoji: "📚",
					},
					style: {
						title: "格式",
						description:"   🎨  代码格式(不影响功能，例如空格、分号等格式修正)",
						emoji: "🎨",
					},
					refactor: {
						title: "重构",
						description:"   🛠   代码重构(不包括 bug 修复、功能新增)",
						emoji: "🛠",
					},
					perf: {
						title: "性能",
						description: "   ⚡️  性能优化",
						emoji: "⚡️",
					},
					test: {
						title: "测试",
						description: "   ✅  添加测试或已有测试改动",
						emoji: "✅",
					},
					build: {
						title: "构建",
						description:
							"   📦  构建流程、外部依赖变更(如升级 npm 包、修改 webpack 配置等)",
						emoji: "📦",
					},
					ci: {
						title: "集成",
						description: "   🎡  修改 CI 配置、脚本",
						emoji: "🎡",
					},
                    chore: {
                      description: "   ♻️   除源代码文件和测试文件之外的改变",
                      title: 'Chores',
                      emoji: '♻️',
                    },
					revert: {
						title: "回退",
						description: "   ⏪️  回滚 commit",
						emoji: "⏪️",
					},
					other: {
						title: "其他",
						description:"   🔨  对构建过程或辅助工具和库的更改(不影响源文件、测试用例)",
						emoji: "🔨",
					},
				},
			},
			scope: {
				description: "选择提交范围(可选):"
			},
			subject: {
				description: "填写简短精炼的变更描述 :\n",
			},
			body: {
				description:
					'填写更加详细的变更描述(可选)。使用 "|" 换行 :\n',
			},
			breaking: {
				description:
					'列举非兼容性重大的变更(可选)。使用 "|" 换行 :\n',
			},
            isBreaking: {
                description: '本次提交是一个不兼容的变更?',             // Are there any breaking changes?
            },
			issues: {
				description: "选择关联issue(可选):",
			},
            isIssueAffected:{
                description:"是否会影响任何未解决的issue问题?"
            },
			issues: {
				description: "列举关联issue (可选) 例如: #31, #I3244 :\n",
			},
		},
	},
};
