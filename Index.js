const content = document.querySelector('.generater .content');
const content_tabs = document.querySelectorAll('.generater .tabs input');
const player_inputs = document.querySelectorAll('.generater .content input.player-name');


function switch_content(index) {
    const transform = index * 400;
    return function (event) {
        content.style.transform = `translateX(-${transform}px)`;
    }
}

function check_input_value(event) {
    const value = event.target.value;
    const filtered = value.replace(/[^a-zA-Z0-9_]/g, ''); // 过滤掉非字母和下划线的字符
    if (filtered !== value) {
        event.target.value = filtered; // 更新输入框的值
    }
}

for (const player_input of player_inputs)
    player_input.addEventListener('input', check_input_value);
for (let index = 0; index < content_tabs.length; index++) {
    const tab = content_tabs[index];
    tab.addEventListener('click', switch_content(index));
}
