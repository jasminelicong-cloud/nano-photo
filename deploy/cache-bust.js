// 缓存清除脚本
console.log('🔄 清除浏览器缓存...');
const timestamp = Date.now();
console.log(`⏰ 当前时间戳: ${timestamp}`);

// 强制重新加载所有资源
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('🗑️ 已清除Service Worker');
        }
    });
}

// 清除本地存储
try {
    localStorage.clear();
    sessionStorage.clear();
    console.log('🧹 已清除本地存储');
} catch(e) {
    console.log('⚠️ 清除存储失败:', e);
}

console.log('✅ 缓存清除完成，请刷新页面');