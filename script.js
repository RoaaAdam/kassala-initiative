document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ الصفحة جاهزة');

    const form = document.getElementById('multiStepForm');
    const pages = document.querySelectorAll('.step-page');
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    // ===== إظهار خطوة معينة =====
    function showStep(index) {
        pages.forEach(p => p.classList.remove('active'));
        pages[index].classList.add('active');
        
        steps.forEach((s, i) => {
            s.classList.remove('active');
            if (i === index) s.classList.add('active');
        });
        
        currentStep = index;
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ===== إظهار/إخفاء تفاصيل التطوع السابق =====
    const volSelect = document.getElementById('previousVolunteerSelect');
    const volDetails = document.getElementById('volunteerDetails');
    const volNameInput = document.getElementById('volNameInput');
    const volRoleInput = document.getElementById('volRoleInput');

    if (volSelect) {
        volSelect.addEventListener('change', function() {
            if (this.value === 'نعم') {
                volDetails.style.display = 'block';
                volNameInput.setAttribute('required', 'required');
                volRoleInput.setAttribute('required', 'required');
            } else {
                volDetails.style.display = 'none';
                volNameInput.removeAttribute('required');
                volRoleInput.removeAttribute('required');
                volNameInput.value = '';
                volRoleInput.value = '';
            }
        });
    }

    // ===== خيارات الاقتراحات في الخطوة الأخيرة =====
    const btnSuggestionsYes = document.getElementById('btnSuggestionsYes');
    const btnSuggestionsNo = document.getElementById('btnSuggestionsNo');
    const suggestionBox = document.getElementById('suggestionBox');
    const userSuggestionsText = document.getElementById('userSuggestionsText');

    if (btnSuggestionsYes && btnSuggestionsNo) {
        btnSuggestionsYes.addEventListener('click', function() {
            suggestionBox.style.display = 'block';
            userSuggestionsText.focus();
            btnSuggestionsYes.classList.add('selected');
            btnSuggestionsNo.classList.remove('selected');
        });

        btnSuggestionsNo.addEventListener('click', function() {
            suggestionBox.style.display = 'none';
            userSuggestionsText.value = '';
            btnSuggestionsNo.classList.add('selected');
            btnSuggestionsYes.classList.remove('selected');
        });
    }

    // ===== التحقق التلقائي والحيوي من البيانات =====
    function validateCurrentStep() {
        const currentPage = pages[currentStep];
        const inputs = currentPage.querySelectorAll('[required]');
        let valid = true;

        currentPage.querySelectorAll('.error-message').forEach(el => el.remove());

        inputs.forEach(inp => {
            inp.classList.remove('error');
            let errorText = '';

            // 1. التحقق من الحقول الفارغة
            if (!inp.value || inp.value.trim() === '') {
                errorText = 'هذا الحقل مطلوب *';
            } 
            // 2. التحقق من خانة الاختيار (Checkbox)
            else if (inp.type === 'checkbox' && !inp.checked) {
                errorText = 'يجب الموافقة على الشرط للاستمرار *';
            }
            // 3. التحقق من أرقام الهواتف والواتساب
            else if (inp.name === 'whatsapp' || inp.name === 'phone') {
                const phoneRegex = /^[0-9+ ]{8,15}$/;
                if (inp.value.trim() !== '' && !phoneRegex.test(inp.value.trim())) {
                    errorText = 'الرجاء إدخال رقم هاتف صحيح (أرقام فقط) *';
                }
            }
            // 4. التحقق من معرف تليجرام
            else if (inp.name === 'telegram' && inp.value.trim() !== '') {
                if (!inp.value.trim().startsWith('@')) {
                    errorText = 'يجب أن يبدأ معرف التليجرام بـ @ *';
                }
            }
            // 5. التحقق من رابط معرض الأعمال (URL)
            else if (inp.name === 'portfolio') {
                const urlRegex = /^(https?:\/\/)?([\w\d\-_]+\.)+[\w\d\-_]+(\/.*)?$/i;
                if (!urlRegex.test(inp.value.trim())) {
                    errorText = 'الرجاء إدخال رابط صحيح يبدأ بـ http:// أو https:// *';
                }
            }

            // إظهار التنبيه الأحمر في حال وجود خطأ
            if (errorText !== '') {
                inp.classList.add('error');
                valid = false;
                const msg = document.createElement('div');
                msg.className = 'error-message show';
                msg.textContent = errorText;
                
                if (inp.type === 'checkbox') {
                    inp.parentElement.appendChild(msg);
                } else {
                    inp.parentNode.appendChild(msg);
                }
            }
        });

        return valid;
    }

    // ===== أزرار "التالي" =====
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!validateCurrentStep()) {
                const container = document.querySelector('.container');
                container.style.animation = 'shake 0.4s ease';
                setTimeout(() => container.style.animation = '', 400);
                return;
            }
            if (currentStep < pages.length - 1) {
                showStep(currentStep + 1);
            }
        });
    });

    // ===== أزرار "السابق" =====
    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    // ===== إرسال النموذج الموحد =====
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateCurrentStep()) {
            const container = document.querySelector('.container');
            container.style.animation = 'shake 0.4s ease';
            setTimeout(() => container.style.animation = '', 400);
            return;
        }

        const botToken = '7920936839:AAF5DkS04wEOcYpg5Hx8FjzrgYWtx5QOalU';
        const chatId = '-1003968061145';

        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        let message = `📥 *تسجيل جديد في مبادرة كسلا*\n\n`;
        message += `👤 *الاسم:* ${data.fullName || ''}\n`;
        message += `🎂 *العمر:* ${data.age || ''}\n`;
        message += `💬 *واتساب:* ${data.whatsapp || ''}\n`;
        message += `📞 *هاتف:* ${data.phone || 'غير مدخل'}\n`;
        message += `✈️ *تليجرام:* ${data.telegram || 'غير مدخل'}\n`;
        message += `🎓 *التخصص:* ${data.profession || ''}\n`;
        message += `🎨 *تطبيق التصميم:* ${data.designApp || ''}\n`;
        message += `📊 *مستوى كانفا:* ${data.canvaLevel || ''}\n`;
        message += `💳 *حساب كانفا:* ${data.canvaAccount || ''}\n`;
        message += `🤝 *تطوع سابق:* ${data.previousVolunteer || ''}\n`;

        if (data.previousVolunteer === 'نعم') {
            message += `🏷️ *اسم المبادرة:* ${data.volunteerInitiativeName || ''}\n`;
            message += `🛠️ *الوظيفة/الدور:* ${data.volunteerRole || ''}\n`;
        }

        message += `🖼️ *رابط الأعمال:* ${data.portfolio || ''}\n`;
        message += `⏰ *الوقت المتاح:* ${data.availableTime || 'لم يحدد'}\n`;
        message += `💡 *المقترحات/الأفكار:* ${data.userSuggestions || 'لا يوجد'}\n`;

        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.textContent = '⏳ جاري الإرسال...';
        submitBtn.disabled = true;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.ok) {
                alert('✅ تم إرسال التسجيل والأفكار بنجاح! شكرًا لك.');
                form.reset();
                if (volDetails) volDetails.style.display = 'none';
                if (suggestionBox) suggestionBox.style.display = 'none';
                showStep(0);
            } else {
                alert('❌ فشل الإرسال، التأكد من صحة التوكين و الـ Chat ID.');
            }
        })
        .catch(err => {
            alert('❌ حدث خطأ في الاتصال بالشبكة.');
        })
        .finally(() => {
            submitBtn.textContent = '✅ إرسال النهائي';
            submitBtn.disabled = false;
        });
    });

    // عرض الخطوة الأولى عند التحميل
    showStep(0);
});