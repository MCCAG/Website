const content = document.querySelector('.generater .content');
const content_tabs = document.querySelectorAll('.generater .tabs input');

const upload = document.querySelector('.generater .content .upload input');
const skin_website_input = document.querySelector('.generater .content input.skin-website');

const backgrounds = [
    '#ffcccb', '#add8e6', '#ffffff',
    'linear-gradient(135deg, #ffcccb 0%, #ffeb3b 100%)',
    'linear-gradient(135deg, #f1eef9 0%, #f5ccf6 100%)',
    'linear-gradient(135deg, #d4fc78 0%, #99e5a2 100%)',
    'linear-gradient(135deg, #41d8dd 0%, #5583ee 100%)',
    'linear-gradient(135deg, #323b42 0%, #121317 100%)'
];

var current_background = 0;
var current = content.querySelector('span#active-content');
var current_canvas = current.querySelector('canvas');
var current_avatar_image = new Image();
current_avatar_image.src = '/Resources/Avatars/LonelySail.png';

function switch_content(index) {
    const transform = index * 400;
    return function (event) {
        current.id = '';
        current = content.querySelector(`span.${event.target.id}`);
        current_canvas = current.querySelector('canvas');
        current.id = 'active-content';
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
    context.clearRect(0, 0, 330, 330);
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

async function request(address, data) {
    console.debug('Request:', address, data);
    try {
        const response = await fetch('https://api.mccag.cn/' + address, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) // 将数据对象转换为 JSON 字符串
        });
        if (response.ok) {
            const response_data = await response.json();
            console.log(response_data);
            if (response_data.success) return response_data.data;
            return alert(response_data.message);
        }
        alert('请求失败，请检查网络连接！');
    } catch (error) {
        console.error(error);
        alert('请求失败，请检查网络连接！');
    }
}

async function generate() {
    const input = current.querySelector('input.player-name');
    if (!input.value) return alert('请输入用户名！');
    if (current.className == 'website' && !skin_website_input.value) return alert('请输入皮肤站地址！');
    const mask = current.querySelector('div.mask');
    mask.style.opacity = 1;
    const send_data = { website: (current.className == 'website' ? (skin_website_input.value.startsWith('http://') || skin_website_input.value.startsWith('https://')) ? skin_website_input.value : 'https://' + skin_website_input.value : null), player: input.value, avatar_type: 'full' }
    const response = await request('generate/account', send_data);
    mask.style.opacity = 0;
    if (!response) return;
    current_avatar_image.src = ('data:image/png;base64,' + response.image);
}

async function generate_upload() {
    if (!upload.files.length) return alert('请选择要上传的图片！');
    const mask = current.querySelector('div.mask');
    mask.style.opacity = 1;
    const reader = new FileReader();
    reader.readAsDataURL(upload.files[0]);
    reader.onload = async function () {
        const image = reader.result.replace('data:image/png;base64,', '');
        const send_data = { skin_image: image, avatar_type: 'full' };
        const response = await request('generate/file', send_data);
        mask.style.opacity = 0;
        if (!response) return;
        current_avatar_image.src = ('data:image/png;base64,' + response.image);
    }
}

current_avatar_image.addEventListener('load', update_canvas);

upload.addEventListener('change', generate_upload);
skin_website_input.addEventListener('input', check_input_value(/[^A-Za-z0-9_.-]/g));
for (const buttons of document.querySelectorAll('.generater .content button.generate'))
    buttons.addEventListener('click', generate);
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
