
document.addEventListener('DOMContentLoaded', () => {
  const symptoms = [
    { id: 'fever', ar: 'حمى / ارتفاع حرارة', en: 'Fever / High temperature', icon: '🤒' },
    { id: 'cough', ar: 'سعال', en: 'Cough', icon: '🤧' },
    { id: 'sore_throat', ar: 'ألم في الحلق', en: 'Sore throat', icon: '😖' },
    { id: 'runny_nose', ar: 'سيلان أو انسداد في الأنف', en: 'Runny/blocked nose', icon: '🤧' },
    { id: 'sneezing', ar: 'عطس متكرر', en: 'Sneezing', icon: '🤧' },
    { id: 'itchy_eyes', ar: 'حكة أو دموع في العين', en: 'Itchy/watery eyes', icon: '👁️' },
    { id: 'headache', ar: 'صداع', en: 'Headache', icon: '🤕' },
    { id: 'abdominal_pain', ar: 'ألم في البطن/المعدة', en: 'Abdominal/stomach pain', icon: '🤢' },
    { id: 'heartburn', ar: 'حرقة/ارتجاع', en: 'Heartburn / Reflux', icon: '🔥' },
    { id: 'nausea', ar: 'غثيان/تقيؤ', en: 'Nausea / Vomiting', icon: '🤮' },
    { id: 'diarrhea', ar: 'إسهال', en: 'Diarrhea', icon: '💩' },
    { id: 'dysuria', ar: 'حرقة عند التبول/ألم', en: 'Pain or burning when urinating', icon: '🚽' },
    { id: 'frequency', ar: 'كثرة التبول', en: 'Frequent urination', icon: '💧' },
    { id: 'blood_urine', ar: 'دم في البول', en: 'Blood in urine', icon: '🩸' },
    { id: 'rash', ar: 'طفح جلدي/حكة', en: 'Skin rash / Itching', icon: '🩹' },
    { id: 'constipation', ar: 'إمساك', en: 'Constipation', icon: '🚫' },
    { id: 'dizzy', ar: 'دوخة/دوار', en: 'Dizziness', icon: '🌀' },
    { id: 'thirst', ar: 'عطش زائد', en: 'Excessive thirst', icon: '💧' },
    { id: 'wound_slow', ar: 'بطء التئام الجروح', en: 'Slow wound healing', icon: '🩺' },
    { id: 'tired', ar: 'تعب شديد/ضعف', en: 'Severe fatigue', icon: '😴' },
    { id: 'nose_bleed', ar: 'نزيف أنفي', en: 'Nosebleed', icon: '🩸' },
  ];

  const filters = document.getElementById('filters');
  symptoms.forEach(s => {
    const el = document.createElement('label');
    el.className = 'filter';
    el.innerHTML = `
      <input type="checkbox" name="symptom" value="${s.id}" />
      <div>
        <div class="label-text">${s.icon} ${s.ar}</div>
        <div class="sub">${s.en}</div>
      </div>
    `;
    filters.appendChild(el);
  });

  function getSelected() {
    const checked = Array.from(document.querySelectorAll('input[name="symptom"]:checked')).map(i => i.value);
    const map = {};
    checked.forEach(c => map[c] = true);
    return map;
  }

  function evaluate(age, weight, selected) {
    if (selected['dizzy'] && selected['chest_pain']) {
      return { emergency: true, ar: 'حالة طارئة: اذهب للمستشفى أو اتصل بالإسعاف', en: 'Emergency: go to hospital or call emergency services' };
    }

    const matches = [];

    // Allergic rhinitis
    if ((selected['sneezing'] || selected['itchy_eyes']) && selected['runny_nose'] && !selected['fever']) {
      matches.push({
        name_ar: 'حساسية أنف (Allergic rhinitis)',
        name_en: 'Allergic rhinitis',
        meds: [
          { ar: 'سيتريزين 10 mg مرة يومياً', en: 'Cetirizine 10 mg once daily' }
        ],
        src: 'https://www.nhs.uk/conditions/seasonal-allergic-rhinitis/'
      });
    }

    // UTI
    if ((selected['dysuria'] || selected['frequency'] || selected['blood_urine']) && (selected['abdominal_pain'] || selected['fever'])) {
      matches.push({
        name_ar: 'التهاب المسالك البولية (UTI)',
        name_en: 'Urinary tract infection (UTI)',
        meds: [
          { ar: 'راجع الطبيب قد يحتاج لمضاد حيوي حسب التشخيص', en: 'See doctor; antibiotics may be needed based on diagnosis' }
        ],
        src: 'https://www.nhs.uk/conditions/urinary-tract-infections-utis/'
      });
    }

    // Diabetes
    if ((selected['thirst'] && selected['frequency']) || (selected['tired'] && selected['wound_slow'])) {
      matches.push({
        name_ar: 'داء السكري (Type 2 Diabetes)',
        name_en: 'Type 2 Diabetes',
        meds: [
          { ar: 'مراجعة وتحاليل دم لتأكيد التشخيص؛ العلاج حسب الطبيب', en: 'Blood tests required; treatment individualized by clinician' }
        ],
        src: 'https://www.mayoclinic.org/diseases-conditions/type-2-diabetes/symptoms-causes/syc-20351193'
      });
    }

    // Influenza / Cold
    if (selected['fever'] && (selected['cough'] || selected['sore_throat'] || selected['headache'])) {
      matches.push({
        name_ar: 'إنفلونزا/نزلة برد (Cold/Flu)',
        name_en: 'Influenza / Common cold',
        meds: [
          { ar: 'باراسيتامول 500 mg كل 4-6 ساعات عند الحاجة', en: 'Paracetamol 500 mg every 4-6 hrs as needed' }
        ],
        src: 'https://www.nhs.uk/conditions/cold-and-flu/'
      });
    }

    // Gastroenteritis
    if (selected['nausea'] && (selected['diarrhea'] || selected['abdominal_pain'])) {
      matches.push({
        name_ar: 'التهاب معدي معوي (Gastroenteritis)',
        name_en: 'Gastroenteritis / Stomach flu',
        meds: [
          { ar: 'تعويض سوائل ORS؛ راجع الطبيب إذا جفاف أو حرارة مرتفعة', en: 'Oral rehydration; see doctor if dehydration or high fever' }
        ],
        src: 'https://www.nhs.uk/conditions/diarrhoea-and-vomiting/'
      });
    }

    // Reflux
    if (selected['heartburn'] || (selected['abdominal_pain'] && selected['heartburn'])) {
      matches.push({
        name_ar: 'ارتجاع مريئي (Reflux)',
        name_en: 'Gastroesophageal reflux (GERD)',
        meds: [
          { ar: 'أوميبرازول 20 mg يومياً بعد مراجعة الطبيب', en: 'Omeprazole 20 mg once daily after medical review' }
        ],
        src: 'https://www.mayoclinic.org/diseases-conditions/gerd/symptoms-causes/syc-20361940'
      });
    }

    // Headache
    if (selected['headache'] && !selected['fever']) {
      matches.push({
        name_ar: 'صداع (Tension/Migraine)',
        name_en: 'Headache (tension/migraine)',
        meds: [
          { ar: 'باراسيتامول 500 mg كل 4-6 ساعات', en: 'Paracetamol 500 mg every 4-6 hrs' }
        ],
        src: 'https://www.nhs.uk/conditions/headaches-and-migraine/'
      });
    }

    // Eczema
    if (selected['rash'] && !selected['fever']) {
      matches.push({
        name_ar: 'أكزيما (Eczema)',
        name_en: 'Eczema',
        meds: [
          { ar: 'مرطبات، ومضادات للحكة حسب الحاجة', en: 'Emollients and topical treatments as advised' }
        ],
        src: 'https://www.nhs.uk/conditions/eczema/'
      });
    }

    // Constipation
    if (selected['constipation']) {
      matches.push({
        name_ar: 'إمساك (Constipation)',
        name_en: 'Constipation',
        meds: [
          { ar: 'زيادة الألياف والسوائل؛ ملين خفيف حسب الحاجة', en: 'Increase fiber and fluids; mild laxative if needed' }
        ],
        src: 'https://www.nhs.uk/conditions/constipation/'
      });
    }

    // Hypertension (note: often asymptomatic)
    if (selected['dizzy'] || selected['nose_bleed'] || selected['headache']) {
      matches.push({
        name_ar: 'ارتفاع ضغط الدم (قد تكون مؤشرات)',
        name_en: 'High blood pressure (possible indicators)',
        meds: [
          { ar: 'راجع الطبيب لقياس الضغط وتقييم الحالة', en: 'See doctor for BP measurement and assessment' }
        ],
        src: 'https://www.nhs.uk/conditions/high-blood-pressure-hypertension/'
      });
    }

    return { matches };
  }

  document.getElementById('survey').addEventListener('submit', (e) => {
    e.preventDefault();
    const age = parseInt(document.getElementById('age').value || '0', 10);
    const weight = parseFloat(document.getElementById('weight').value || '0');
    if (!age && age !== 0) { alert('أدخل عمرك'); return; }

    const selected = getSelected();
    const out = evaluate(age, weight, selected);
    const resEl = document.getElementById('result');
    resEl.style.display = 'block';
    resEl.innerHTML = '';

    if (out.emergency) {
      resEl.innerHTML = `<h3>⚠️ ${out.ar}</h3><p style="color:#a33">${out.en}</p>`;
      return;
    }

    if (out.matches.length === 0) {
      resEl.innerHTML = `<p>لم تتطابق الأعراض مع سيناريو محدد. استشر مقدم رعاية صحية.<br><span style="color:#2f6f8a">Symptoms did not match a specific scenario. Consult a healthcare provider.</span></p>`;
    } else {
      out.matches.forEach(m => {
        const block = document.createElement('div');
        block.style.marginBottom = '12px';
        const medsHtml = m.meds.map(md => `<li><strong>${md.ar}</strong><br><span style="color:#2f6f8a">${md.en}</span></li>`).join('');
        block.innerHTML = `
          <h3>${m.name_ar} <span style="font-size:13px;color:#2f6f8a">/ ${m.name_en}</span></h3>
          <p><strong>أمثلة علاجية / Example treatments:</strong></p>
          <ul class="med-list">${medsHtml}</ul>
          <p class="note">مصدر (Source): <a href="${m.src}" target="_blank" rel="noopener">${m.src}</a></p>
        `;
        resEl.appendChild(block);
      });

      const tips = document.createElement('div');
      tips.innerHTML = `<h4>نصائح عامة / General tips</h4>
        <ul>
          <li>اشرب سوائل كافية — Drink plenty of fluids.</li>
          <li>خذ قسطًا من الراحة — Rest well.</li>
          <li>استشر الطبيب أو الصيدلي قبل تناول أي دواء — Consult a clinician/pharmacist before taking meds.</li>
        </ul>`;
      resEl.appendChild(tips);
    }

    resEl.scrollIntoView({behavior:'smooth'});
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('survey').reset();
    const resEl = document.getElementById('result');
    resEl.style.display = 'none';
    resEl.innerHTML = '';
    window.scrollTo({top:0, behavior:'smooth'});
  });

  function getSelected() {
    const checked = Array.from(document.querySelectorAll('input[name="symptom"]:checked')).map(i => i.value);
    const map = {};
    checked.forEach(c => map[c] = true);
    return map;
  }
});
