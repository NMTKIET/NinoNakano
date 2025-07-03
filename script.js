// JavaScript cho hiệu ứng mưa rơi
function createRaindrop() {
    const rain = document.createElement('div');
    rain.classList.add('rain');
    rain.style.left = Math.random() * window.innerWidth + 'px';
    rain.style.animationDelay = Math.random() * 2 + 's';
    rain.style.animationDuration = (0.8 + Math.random() * 0.7) + 's';
    document.body.appendChild(rain);
    rain.addEventListener('animationend', () => {
        rain.remove();
    });
}

const maxRaindrops = 100; // Số lượng hạt mưa tối đa trên màn hình
let currentRaindrops = 0;

function startRain() {
    function animateRain() {
        if (currentRaindrops < maxRaindrops) {
            createRaindrop();
            currentRaindrops++;
        }
        requestAnimationFrame(animateRain); 
    }
    animateRain();
}

document.addEventListener('DOMContentLoaded', startRain);


// Logic Animation Progress Bar và hiển thị Key
document.addEventListener('DOMContentLoaded', function() {
    const cardTitle = document.getElementById('cardTitle');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressPercentage = document.getElementById('progressPercentage');
    const keyContent = document.getElementById('keyContent'); // Div chứa key/nút cuối cùng
    const copyKeyBtnInitial = document.getElementById('copyKeyBtnInitial'); // Nút sao chép ban đầu
    const copyKeyBtnFinal = document.getElementById('copyKeyBtnFinal'); // Nút sao chép sau khi key được tạo
    
    let currentProgress = 0;
    const animationDuration = 3000; // Tổng thời gian animation (3 giây)
    const updateInterval = 50; // Cập nhật thanh tiến trình mỗi 50ms
    const incrementPerInterval = (100 / (animationDuration / updateInterval)); // Lượng tăng mỗi lần cập nhật

    // Ẩn nút ban đầu và nội dung key lúc khởi tạo
    if (copyKeyBtnInitial) copyKeyBtnInitial.style.display = 'block'; // Đảm bảo nút ban đầu hiển thị
    if (keyContent) keyContent.style.display = 'none'; // Đảm bảo nội dung key cuối cùng ẩn

    const animateProgressBar = setInterval(() => {
        currentProgress += incrementPerInterval;
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(animateProgressBar);
            showKeyOrErrorMessage(); // Gọi hàm hiển thị key hoặc thông báo lỗi
        }
        progressBarFill.style.width = currentProgress + '%';
        progressPercentage.textContent = Math.floor(currentProgress) + '%';
    }, updateInterval);

    function showKeyOrErrorMessage() {
        cardTitle.textContent = 'Key đã được tạo!'; // Thay đổi tiêu đề
        progressPercentage.style.display = 'none'; // Ẩn phần trăm
        
        if (copyKeyBtnInitial) copyKeyBtnInitial.style.display = 'none'; // Ẩn nút ban đầu
        if (keyContent) keyContent.style.display = 'block'; // Hiển thị nội dung key/nút cuối cùng

        const urlParams = new URLSearchParams(window.location.search);
        const key = urlParams.get('key'); // Lấy key từ URL

        // Xóa bất kỳ nội dung key cũ nào nếu có
        const existingKeyDisplay = keyContent.querySelector('.generated-key');
        if (existingKeyDisplay) {
            existingKeyDisplay.remove();
        }
        
        // Tạo một thẻ span để hiển thị key hoặc thông báo lỗi
        const messageDisplaySpan = document.createElement('span');
        messageDisplaySpan.className = 'generated-key'; // Vẫn dùng class này để style
        messageDisplaySpan.style.marginBottom = '20px';
        messageDisplaySpan.style.display = 'block';

        if (key) {
            // Nếu có key trong URL, hiển thị key
            messageDisplaySpan.textContent = key;
            if (copyKeyBtnFinal) {
                copyKeyBtnFinal.style.display = 'block'; // Hiển thị nút sao chép
                copyKeyBtnFinal.onclick = function() {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(key)
                            .then(() => {
                                alert('Key đã được sao chép: ' + key);
                            })
                            .catch(err => {
                                console.error('Không thể sao chép Key: ', err);
                                alert('Lỗi khi sao chép Key!');
                            });
                    } else {
                        const textArea = document.createElement("textarea");
                        textArea.value = key;
                        textArea.style.position = "fixed";
                        textArea.style.left = "-999999px";
                        textArea.style.top = "-999999px";
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        try {
                            document.execCommand('copy');
                            alert('Key đã được sao chép (fallback): ' + key);
                        } catch (err) {
                            console.error('Fallback: Không thể sao chép Key: ', err);
                            alert('Lỗi khi sao chép Key! Vui lòng sao chép thủ công: ' + key);
                        }
                        document.body.removeChild(textArea);
                    }
                };
            }
        } else {
            // Nếu không có key trong URL, hiển thị thông báo lỗi
            messageDisplaySpan.textContent = 'Không tìm thấy key!';
            messageDisplaySpan.style.color = '#dc3545'; // Màu đỏ cho thông báo lỗi
            messageDisplaySpan.style.fontSize = '1.5em'; // Lớn hơn một chút
            messageDisplaySpan.style.fontWeight = 'bold';
            if (copyKeyBtnFinal) {
                copyKeyBtnFinal.style.display = 'none'; // Ẩn nút sao chép nếu không có key
            }
        }

        // Chèn messageDisplaySpan vào trước nút cuối cùng (hoặc là phần tử duy nhất nếu nút ẩn)
        if (copyKeyBtnFinal && keyContent) {
            keyContent.insertBefore(messageDisplaySpan, copyKeyBtnFinal);
        } else if (keyContent) { // Nếu nút cuối cùng bị ẩn ngay từ đầu
            keyContent.appendChild(messageDisplaySpan);
        }
    }

    // Hàm generateRandomKey không còn được sử dụng
    /*
    function generateRandomKey(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    */
});