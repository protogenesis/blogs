### Stop the back action while touching webpage in your mobile browsers.

[CN](../H5%20中阻止浏览器前进后退手势.md)

Actually, that's an annoying experience while you are sliding the block captcha and suddenly the browser returns to the previous page.

But the resolution is a bit easy, just add the code as show below to your CSS file.

```css
<style>
    html {
         touch-action: none;
    }
</style>
```

The ```touch-action``` means ```Determines whether touch input may trigger default behavior supplied by user agent. ```

By this, the webpage would work normally. 





