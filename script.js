// ===== انتظر تحميل الصفحة بالكامل =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ الصفحة جاهزة');

    const form = document.getElementById('multiStepForm');
    const pages = document.querySelectorAll('.step-page');
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    // ===== عرض صفحة معينة =====
    function showStep(index) {
        console.log('👉 ننتقل إلى الخطوة:', index + 1);
        
        // إخفاء كل الصفحات
        pages.forEach((p, i) => {
            p.classList.remove('active');
        });
        
        // إظهار الصفحة المطلوبة
        pages[index].classList.add('active');
        
        // تحديث مؤشر الخطوات
        steps.forEach((s, i) => {
            s.classList.remove('active');
            if (i === index) {
                s.classList.add('active');
            }
        });
        
        currentStep = index;
        
        // تمرير لأعلى الصفحة
        document.querySelector('.container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    // ===== التحقق من الحقول المطلوبة =====
    function validateCurrentStep() {
        const currentPage = pages[currentStep];
        const inputs = currentPage.querySelectorAll('[required]');
        let valid = true;

        // إزالة رسائل الخطأ القديمة
        currentPage.querySelectorAll('.error-message').forEach(el => el.remove());

        inputs.forEach(inp => {
            inp.classList.remove('error');
            
            // التحقق من التشيك بوكس
            if (inp.type === 'checkbox') {
                if (!inp.checked) {
                    inp.classList.add('error');
                    valid = false;
                    const msg = document.createElement('div');
                    msg.className = 'error-message show';
                    msg.textContent = 'يجب الموافقة على هذا الشرط *';
                    inp.parentElement.appendChild(msg);
                }
                return;
            }

            // التحقق من الحقول الأخرى
            if (!inp.value || inp.value.trim() === '') {
                inp.classList.add('error');
                valid = false;
                const msg = document.createElement('div');
                msg.className = 'error-message show';
                msg.textContent = 'هذا الحقل مطلوب *';
                inp.parentElement.appendChild(msg);
            }
        });

        return valid;
    }

    // ===== أزرار "التالي" =====
    const nextButtons = document.querySelectorAll('.next-btn');
    console.log('🔘 عدد أزرار التالي:', nextButtons.length);

    nextButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('👉 تم الضغط على "التالي" في الخطوة:', currentStep + 1);

            if (!validateCurrentStep()) {
                // هز الصفحة كتنبيه
                const container = document.querySelector('.container');
                container.style.animation = 'shake 0.4s ease';
                setTimeout(() => container.style.animation = '', 400);
                return;
            }

            if (currentStep < pages.length - 1) {
                showStep(currentStep + 1);
            } else {
                console.log('⚠️ أنت في آخر خطوة');
            }
        });
    });

    // ===== أزرار "السابق" =====
    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('👉 تم الضغط على "السابق" في الخطوة:', currentStep + 1);
            
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    // ===== إرسال النموذج =====
    form.addEventListener('submit', function(e) {
        e.preventDefault();
    
        if (!validateCurrentStep()) {
            const container = document.querySelector('.container');
            container.style.animation = 'shake 0.4s ease';
            setTimeout(() => container.style.animation = '', 400);
            return;
        }
    
        // ⚠️ استبدل النصوص بالبيانات الحقيقية بين العلامات ''
        const botToken = '7920936839:AAF5DkS04wEOcYpg5Hx8FjzrgYWtx5QOalU';
        const chatId = '-1003968061145';
    
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
    
        let message = `📥 *تسجيل جديد في مبادرة كسلا*\n\n`;
        message += ` *الاسم:* ${data.fullName || ''}\n`;
        message += ` *العمر:* ${data.age || ''}\n`;
        message += ` *واتساب:* ${data.whatsapp || ''}\n`;
        message += ` *هاتف:* ${data.phone || 'غير مدخل'}\n`;
        message += `️ *تليجرام:* ${data.telegram || 'غير مدخل'}\n`;
        message += ` *التخصص:* ${data.profession || ''}\n`;
        message += ` *التطبيق:* ${data.designApp || ''}\n`;
        message += ` *مستوى كانفا:* ${data.canvaLevel || ''}\n`;
        message += ` *حساب كانفا:* ${data.canvaAccount || ''}\n`;
        message += ` *رابط الأعمال:* ${data.portfolio || ''}\n`;
        message += ` *خبرة تطوعية:* ${data.previousVolunteer || ''}\n`;
        message += ` *الوقت المتاح:* ${data.availableTime || 'لم يحدد'}\n`;
    
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
                alert('✅ تم إرسال البيانات بنجاح!');
                form.reset();
                showStep(0);
            } else {
                alert('❌ فشل الإرسال، تأكد من صحة التوكين والـ ID.');
            }
        })
        .catch(err => {
            alert('❌ حدث خطأ في الاتصال بالشبكة.');
        })
        .finally(() => {
            submitBtn.textContent = '✅ إرسال';
            submitBtn.disabled = false;
        });
    });

        // جمع البيانات
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        console.log('📦 البيانات المرسلة:', data);
        alert('✅ تم التسجيل بنجاح! سنتواصل معك قريباً.');
        
        // (اختياري) إعادة تعيين النموذج
        // form.reset();
        // showStep(0);
    });

    // ===== بداية: عرض أول صفحة =====
    showStep(0);
