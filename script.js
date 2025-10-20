// Content: dynamic description injection, lightbox, chat/order flow

const descriptionText = `Молния 1.0 — это не следующий шаг, а целый прыжок в будущее логистики. Первый в мире шарообразный робот-доставщик, созданный для тех, для кого каждая деталь имеет значение. Он предназначен для доставки предметов с ПВЗ: хрупких изделий, произведений искусства, ювелирных изделий, медицинских препаратов и других ценных активов, где абсолютная надежность, безопасность и безупречность — не пожелание, а обязательное условие.
С его помощью вы не просто безопасно передаете груз. Вы декларируете свой статус и передовой подход к бизнесу. Безопасность осуществляется засчёт мягких поверхностей и устойчивости к любых внешним воздействиям.`;

document.addEventListener('DOMContentLoaded', () => {
  // Inject description
  const desc = document.getElementById('description');
  if (desc) desc.textContent = descriptionText;

  // Current year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear().toString();

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  document.querySelectorAll('.thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      const full = btn.getAttribute('data-full');
      if (lightbox && lightboxImg && full) {
        lightboxImg.setAttribute('src', full);
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      }
    });
  });
  lightboxClose?.addEventListener('click', () => {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
  });
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });

  // Chat widget
  const chatToggle = document.querySelector('.chat-toggle');
  const chatWindow = document.querySelector('.chat-window');
  const chatClose = document.querySelector('.chat-close');
  const chatMessages = document.getElementById('chatMessages');
  const orderForm = document.getElementById('orderForm');

  function openChat() {
    chatWindow?.classList.add('open');
    chatWindow?.setAttribute('aria-hidden', 'false');
    if (chatMessages && chatMessages.childElementCount === 0) {
      addBotMessage('Здравствуйте! Готовы оформить заказ на «Молния 1.0». Выберите способ получения и заполните форму.');
    }
  }
  function closeChat() {
    chatWindow?.classList.remove('open');
    chatWindow?.setAttribute('aria-hidden', 'true');
  }
  chatToggle?.addEventListener('click', openChat);
  chatClose?.addEventListener('click', closeChat);

  document.querySelectorAll('[data-open-chat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      openChat();
      const radioId = mode === 'pickup' ? 'modePickup' : 'modeDelivery';
      const radio = document.getElementById(radioId);
      if (radio) {
        radio.checked = true;
        updateModeFields(mode === 'pickup' ? 'pickup' : 'delivery');
      }
    });
  });

  function addBotMessage(text) {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = 'bubble bot';
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function addUserMessage(text) {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = 'bubble user';
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function updateModeFields(mode) {
    const addressRow = document.querySelector('[data-field="address"]');
    const pickupRow = document.querySelector('[data-field="pickupPoint"]');
    if (mode === 'pickup') {
      addressRow?.setAttribute('hidden', '');
      pickupRow?.removeAttribute('hidden');
    } else {
      pickupRow?.setAttribute('hidden', '');
      addressRow?.removeAttribute('hidden');
    }
  }

  document.getElementById('modeDelivery')?.addEventListener('change', () => updateModeFields('delivery'));
  document.getElementById('modePickup')?.addEventListener('change', () => updateModeFields('pickup'));

  orderForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(orderForm);
    const mode = (data.get('mode') || 'delivery').toString();
    const name = (data.get('name') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const when = (data.get('when') || '').toString().trim();
    const address = (data.get('address') || '').toString().trim();
    const pickupPoint = (data.get('pickupPoint') || '').toString().trim();

    const issues = [];
    if (!name) issues.push('Имя');
    if (!phone) issues.push('Телефон');
    if (!when) issues.push('Время');
    if (mode === 'delivery' && !address) issues.push('Адрес');
    if (mode === 'pickup' && !pickupPoint) issues.push('ПВЗ');

    if (issues.length) {
      addBotMessage('Пожалуйста, заполните: ' + issues.join(', '));
      return;
    }

    addUserMessage(`Заказ: Молния 1.0 — 409 999 ₽; способ: ${mode === 'delivery' ? 'доставка' : 'самовывоз'}.`);
    const summary = mode === 'delivery' ? `Адрес: ${address}` : `ПВЗ: ${pickupPoint}`;
    addUserMessage(`Контакты: ${name}, ${phone}. ${summary}. Время: ${when}`);

    setTimeout(() => {
      addBotMessage('Спасибо! Заявка принята. Мы свяжемся с вами для подтверждения заказа и оплаты.');
    }, 400);
  });
});


