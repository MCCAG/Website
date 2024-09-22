const player_input = document.querySelector('.generater .content input');

player_input.addEventListener('input', function (event) {
    // 只允许字母和下划线
    const value = event.target.value;
    const filtered = value.replace(/[^a-zA-Z0-9_]/g, ''); // 过滤掉非字母和下划线的字符
    if (filtered !== value) {
        event.target.value = filtered; // 更新输入框的值
    }
});
