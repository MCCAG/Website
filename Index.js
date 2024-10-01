const api_url = 'https://api.mccag.cn';
const content = document.querySelector('.generater .content');
const content_tabs = document.querySelectorAll('.generater .tabs input');

const backgrounds = [
    '#ffcccb', '#add8e6', '#ffffff',
    'linear-gradient(135deg, #ffcccb 0%, #ffeb3b 100%)',
    'linear-gradient(135deg, #f1eef9 0%, #f5ccf6 100%)',
    'linear-gradient(135deg, #d4fc78 0%, #99e5a2 100%)',
    'linear-gradient(135deg, #41d8dd 0%, #5583ee 100%)',
    'linear-gradient(135deg, #323b42 0%, #121317 100%)'
];

var current_background = 0;
var current = content.querySelector('span.mojang');
var current_canvas = current.querySelector('canvas.avatar');
var current_avatar_image = new Image();
current_avatar_image.src = '/Resources/Avatars/LonelySail.png';

function request(address, callback) {
    fetch(api_url + address).then(response => {
        if (response.ok) return response.json();
        alert('请求失败，请检查网络连接！');
    }).then(data => callback(data));
}

function switch_content(index) {
    const transform = index * 400;
    return function (event) {
        current = content.querySelector(`span.${event.target.id}`);
        current_canvas = current.querySelector('canvas.avatar');
        content.style.transform = `translateX(-${transform}px)`;
        update_canvas();
    }
}

function check_input_value(regax) {
    return function (event) {
        const value = event.target.value;
        const filtered = value.replace(regax, ''); // 过滤掉非字母和下划线的字符
        if (filtered !== value) {
            event.target.value = filtered; // 更新输入框的值
        }
    }
}

function update_canvas() {
    const context = current_canvas.getContext('2d');
    const background = backgrounds[current_background];
    if (background.startsWith('linear-gradient')) {
        const colors = background.match(/#\w{6}/g);
        const gradient = context.createLinearGradient(0, 0, 330, 330);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        context.fillStyle = gradient;
    } else context.fillStyle = background;
    context.fillRect(0, 0, 330, 330);
    context.drawImage(current_avatar_image, 0, 0, 330, 330);
}

function generate() {
    request('generate/account')
}

function download() {
    const link = document.createElement('a');
    link.download = 'Avatar.png';
    link.href = current_canvas.toDataURL('image/png');
    link.click();
    link.remove();
}

function change_background() {
    current_background += 1;
    if (current_background >= backgrounds.length) current_background = 0;
    update_canvas();
}

window.addEventListener('load', update_canvas);
const skin_website_input = document.querySelector('.generater .content input.skin-website');
skin_website_input.addEventListener('input', check_input_value(/[^A-Za-z0-9_.-]/g));
for (const buttons of document.querySelectorAll('.generater .content button.download'))
    buttons.addEventListener('click', download);
for (const buttons of document.querySelectorAll('.generater .content button.change-background'))
    buttons.addEventListener('click', change_background);
for (const player_input of document.querySelectorAll('.generater .content input.player-name'))
    player_input.addEventListener('input', check_input_value(/[^A-Za-z0-9_]/g));
for (let index = 0; index < content_tabs.length; index++) {
    const tab = content_tabs[index];
    tab.addEventListener('click', switch_content(index));
}
