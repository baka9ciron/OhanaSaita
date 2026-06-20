// 平滑滚动导航
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 留言板功能
function addMessage() {
    const nameInput = document.getElementById('nameInput');
    const messageInput = document.getElementById('messageInput');
    const guestbookMessages = document.getElementById('guestbookMessages');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        alert('请输入名字和留言！');
        return;
    }

    // 创建新留言元素
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN');

    messageItem.innerHTML = `
        <div class="message-header">
            <strong>${escapeHtml(name)}</strong>
            <span class="message-time">${timeStr}</span>
        </div>
        <p class="message-text">${escapeHtml(message)}</p>
    `;

    // 添加到留言板
    guestbookMessages.insertBefore(messageItem, guestbookMessages.firstChild);

    // 清空输入框
    nameInput.value = '';
    messageInput.value = '';
    nameInput.focus();

    // 保存到本地存储
    saveMessages();
}

// 防止XSS攻击的HTML转义
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 保存留言到本地存储
function saveMessages() {
    const guestbookMessages = document.getElementById('guestbookMessages');
    const messages = [];
    
    guestbookMessages.querySelectorAll('.message-item').forEach(item => {
        const header = item.querySelector('.message-header');
        const name = header.querySelector('strong').textContent;
        const time = header.querySelector('.message-time').textContent;
        const text = item.querySelector('.message-text').textContent;
        
        messages.push({ name, time, text });
    });
    
    localStorage.setItem('guestbookMessages', JSON.stringify(messages));
}

// 从本地存储加载留言
function loadMessages() {
    const saved = localStorage.getItem('guestbookMessages');
    if (saved) {
        try {
            const messages = JSON.parse(saved);
            const guestbookMessages = document.getElementById('guestbookMessages');
            
            // 清空默认留言
            guestbookMessages.innerHTML = '';
            
            // 加载保存的留言
            messages.forEach(msg => {
                const messageItem = document.createElement('div');
                messageItem.className = 'message-item';
                messageItem.innerHTML = `
                    <div class="message-header">
                        <strong>${escapeHtml(msg.name)}</strong>
                        <span class="message-time">${msg.time}</span>
                    </div>
                    <p class="message-text">${escapeHtml(msg.text)}</p>
                `;
                guestbookMessages.appendChild(messageItem);
            });
        } catch (e) {
            console.error('加载留言出错:', e);
        }
    }
}

// 回车快速发送留言
document.addEventListener('DOMContentLoaded', function() {
    loadMessages();
    
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                addMessage();
            }
        });
    }
});

// 欢迎信息
console.log('欢迎访问 OhanaSaita 的个人网站！');
console.log('目标是成为神 ✨');
console.log('如果你想了解更多，请查看源代码或通过 GitHub 联系我。');