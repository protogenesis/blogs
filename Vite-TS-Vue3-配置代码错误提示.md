Vite + TS + Vue3 配置代码错误提示

在 Vite 中，当类型检测工具检测到错误时，项目还是可以正常运行的，如果需要在终端和网页中弹出错误提示，则需要新增一个 Vite 配置：

```
npm install vite-plugin-checker vue-tsc -D
```

在 Vite.config.ts 中新增 plugin:

```typescript
import checker from 'vite-plugin-checker'

export default () => {
	plugins: [
		checker({
			vueTsc: true
		})
	]
}
```

重新启动以后，如果代码中出现类型错误，终端和网页中都会弹出错误提示。



在线演示：https://stackblitz.com/edit/vitejs-vite-e8pddl