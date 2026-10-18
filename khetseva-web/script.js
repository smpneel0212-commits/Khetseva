/**
 * KhetSeva: Har Kisan Ke Liye Ek Digital Saathi
 * Interactive Functional Controller (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Interactive Tool Tabs Switcher
     ========================================================================== */
  const toolTabs = document.querySelectorAll('.tool-tab');
  const toolPanels = document.querySelectorAll('.tool-panel');

  toolTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      toolTabs.forEach(t => t.classList.remove('active'));
      toolPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(tab.dataset.tab);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     2. Custom-Hiring ("Machine + Crew") Estimator
     ========================================================================== */
  const serviceTypeSelect = document.getElementById('serviceType');
  const farmAcresSlider = document.getElementById('farmAcres');
  const acresValueDisplay = document.getElementById('acresValue');
  const bookingUrgencySelect = document.getElementById('bookingUrgency');
  const ratePerAcreDisplay = document.getElementById('ratePerAcre');
  const servicePackageDesc = document.getElementById('servicePackageDesc');
  const summaryAcresDisplay = document.getElementById('summaryAcres');
  const estimatedHoursDisplay = document.getElementById('estimatedHours');
  const totalBookingCostDisplay = document.getElementById('totalBookingCost');
  const btnBookMock = document.getElementById('btnBookMock');
  const bookingConfirmation = document.getElementById('bookingConfirmation');

  const serviceCatalog = {
    tillage: {
      rate: 1200,
      hoursPerAcre: 1.0,
      desc: "Includes: 50HP Tractor, Heavy Rotavator, Verified Driver, and Fuel"
    },
    spraying: {
      rate: 450,
      hoursPerAcre: 0.25,
      desc: "Includes: 16L Agriculture Drone, DGCA Certified Pilot, Chemical Mixer, 2 Batteries"
    },
    harvesting: {
      rate: 2400,
      hoursPerAcre: 1.2,
      desc: "Includes: Multi-Crop Combine Harvester, Sacking Squad (3 crew members), Fuel"
    },
    sowing: {
      rate: 950,
      hoursPerAcre: 0.8,
      desc: "Includes: 45HP Tractor, Zero-Till Precision Seed Drill, Metering Expert, Fuel"
    }
  };

  function updateHiringCalculator() {
    if (!serviceTypeSelect || !farmAcresSlider) return;

    const selectedServiceKey = serviceTypeSelect.value;
    const serviceInfo = serviceCatalog[selectedServiceKey] || serviceCatalog.tillage;
    const acres = parseInt(farmAcresSlider.value, 10);
    const urgency = bookingUrgencySelect.value;

    let baseRate = serviceInfo.rate;
    let urgencyMultiplier = urgency === 'urgent' ? 1.15 : 1.0;
    let effectiveRate = Math.round(baseRate * urgencyMultiplier);

    let totalCost = effectiveRate * acres;
    let totalHours = (acres * serviceInfo.hoursPerAcre).toFixed(1);

    acresValueDisplay.textContent = `${acres} ${acres === 1 ? 'Acre' : 'Acres'}`;
    summaryAcresDisplay.textContent = `${acres} ${acres === 1 ? 'Acre' : 'Acres'}`;
    ratePerAcreDisplay.textContent = `₹${effectiveRate.toLocaleString('en-IN')} / Acre ${urgency === 'urgent' ? '(Priority)' : ''}`;
    servicePackageDesc.textContent = serviceInfo.desc;
    estimatedHoursDisplay.textContent = `~${totalHours} Hours`;
    totalBookingCostDisplay.textContent = `₹${totalCost.toLocaleString('en-IN')}`;
  }

  if (serviceTypeSelect && farmAcresSlider && bookingUrgencySelect) {
    serviceTypeSelect.addEventListener('change', updateHiringCalculator);
    farmAcresSlider.addEventListener('input', updateHiringCalculator);
    bookingUrgencySelect.addEventListener('change', updateHiringCalculator);
    updateHiringCalculator();
  }

  if (btnBookMock && bookingConfirmation) {
    btnBookMock.addEventListener('click', () => {
      const acres = farmAcresSlider.value;
      const serviceName = serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text.split('(')[0].trim();
      const randomOrderId = 'KHET-' + Math.floor(100000 + Math.random() * 900000);
      
      btnBookMock.disabled = true;
      btnBookMock.textContent = 'Assigning Nearest Cluster Hub...';

      setTimeout(() => {
        bookingConfirmation.classList.remove('hidden');
        bookingConfirmation.innerHTML = `
          <strong>🎉 Booking Confirmed! [ID: ${randomOrderId}]</strong><br>
          Machine + Crew assigned for <strong>${acres} Acres</strong> (${serviceName}).<br>
          Hub Operator will contact you via audio call with arrival ETA.
        `;
        btnBookMock.disabled = false;
        btnBookMock.textContent = 'Book Another Service';
      }, 700);
    });
  }

  /* ==========================================================================
     3. APMC Mandi Profitability Calculator
     ========================================================================== */
  const cropSelect = document.getElementById('cropSelect');
  const cropQuantitySlider = document.getElementById('cropQuantity');
  const qtyDisplay = document.getElementById('qtyDisplay');
  const mandiDestRadios = document.querySelectorAll('input[name="mandiDest"]');
  const mandiNetRevenue = document.getElementById('mandiNetRevenue');
  const mandiGrossDisplay = document.getElementById('mandiGross');
  const mandiFreightDisplay = document.getElementById('mandiFreight');
  const middlemanSavedDisplay = document.getElementById('middlemanSaved');
  const mandiAnalysisText = document.getElementById('mandiAnalysisText');
  const mandiRecommendation = document.getElementById('mandiRecommendation');

  const mandiPricing = {
    wheat: { name: 'Wheat', localPrice: 2350, regionalPrice: 2520 },
    mustard: { name: 'Mustard', localPrice: 5300, regionalPrice: 5650 },
    chana: { name: 'Chana', localPrice: 5650, regionalPrice: 6050 },
    soybean: { name: 'Soybean', localPrice: 4500, regionalPrice: 4850 }
  };

  function updateMandiCalculator() {
    if (!cropSelect || !cropQuantitySlider) return;

    const cropKey = cropSelect.value;
    const crop = mandiPricing[cropKey] || mandiPricing.wheat;
    const qty = parseInt(cropQuantitySlider.value, 10);
    const selectedDest = document.querySelector('input[name="mandiDest"]:checked')?.value || 'local';

    qtyDisplay.textContent = `${qty} Quintals`;

    // Local Mandi calculations (8 km)
    const localGross = crop.localPrice * qty;
    const localFreight = Math.max(600, qty * 18);
    const localNet = localGross - localFreight;

    // Regional Mandi calculations (35 km)
    const regionalGross = crop.regionalPrice * qty;
    const regionalFreight = Math.max(1600, qty * 55);
    const regionalNet = regionalGross - regionalFreight;

    // Direct platform commission savings (approx 4% middleman arhatiya fee)
    const middlemanSavings = Math.round((selectedDest === 'local' ? localGross : regionalGross) * 0.04);

    let activeGross, activeFreight, activeNet;
    if (selectedDest === 'local') {
      activeGross = localGross;
      activeFreight = localFreight;
      activeNet = localNet;
    } else {
      activeGross = regionalGross;
      activeFreight = regionalFreight;
      activeNet = regionalNet;
    }

    mandiGrossDisplay.textContent = `₹${activeGross.toLocaleString('en-IN')}`;
    mandiFreightDisplay.textContent = `- ₹${activeFreight.toLocaleString('en-IN')}`;
    mandiNetRevenue.textContent = `₹${activeNet.toLocaleString('en-IN')}`;
    middlemanSavedDisplay.textContent = `+ ₹${middlemanSavings.toLocaleString('en-IN')} (4% commission saved)`;

    const profitDifference = regionalNet - localNet;

    if (profitDifference > 0) {
      mandiRecommendation.className = 'recommendation-badge';
      mandiRecommendation.innerHTML = `
        ✓ <strong>Smart Advisory:</strong> Selling at <strong>Regional Mandi</strong> yields 
        <strong style="color: #0369a1;">₹${profitDifference.toLocaleString('en-IN')} higher net profit</strong> 
        even after covering additional transit diesel!
      `;
      mandiAnalysisText.textContent = `Regional APMC offers +₹${crop.regionalPrice - crop.localPrice}/Qtl price premium. Transport cost is well offset by the higher volume.`;
    } else {
      mandiRecommendation.className = 'recommendation-badge';
      mandiRecommendation.innerHTML = `
        ✓ <strong>Smart Advisory:</strong> For ${qty} Quintals, <strong>Local Mandi</strong> is more profitable due to transport freight savings of ₹${Math.abs(profitDifference).toLocaleString('en-IN')}.
      `;
      mandiAnalysisText.textContent = `Freight to the regional market exceeds the price premium for this quantity.`;
    }
  }

  if (cropSelect && cropQuantitySlider) {
    cropSelect.addEventListener('change', updateMandiCalculator);
    cropQuantitySlider.addEventListener('input', updateMandiCalculator);
    mandiDestRadios.forEach(radio => radio.addEventListener('change', updateMandiCalculator));
    updateMandiCalculator();
  }

  /* ==========================================================================
     4. Hyper-Local Weather & Spraying Advisory Simulator
     ========================================================================== */
  const rainSlider = document.getElementById('rainProbability');
  const rainDisplay = document.getElementById('rainDisplay');
  const windSlider = document.getElementById('windSpeed');
  const windDisplay = document.getElementById('windDisplay');
  const chemicalTypeSelect = document.getElementById('chemicalType');
  const advisoryCard = document.getElementById('advisoryCard');
  const advisoryIcon = document.getElementById('advisoryIcon');
  const advisoryHeadline = document.getElementById('advisoryHeadline');
  const advisoryBody = document.getElementById('advisoryBody');
  const advisoryAction = document.getElementById('advisoryAction');

  function updateWeatherAdvisory() {
    if (!rainSlider || !windSlider) return;

    const rainProb = parseInt(rainSlider.value, 10);
    const windSpeed = parseInt(windSlider.value, 10);
    const chemType = chemicalTypeSelect.options[chemicalTypeSelect.selectedIndex].text;

    rainDisplay.textContent = `${rainProb}% Chance`;
    windDisplay.textContent = `${windSpeed} km/h`;

    advisoryCard.classList.remove('risk-high', 'risk-moderate', 'risk-safe');

    if (rainProb >= 40) {
      // High washout risk
      advisoryCard.classList.add('risk-high');
      advisoryIcon.textContent = '🌧️ ⚠️';
      advisoryHeadline.textContent = 'DO NOT SPRAY — HIGH WASHOUT RISK';
      advisoryBody.textContent = `Precipitation probability is ${rainProb}% in your field's micro-zone within 12 hours. Applying ${chemType} now risks complete chemical runoff into the soil, wasting your investment.`;
      advisoryAction.innerHTML = `<strong>Action Required:</strong> Postpone spraying by 48 hours. KhetSeva alert will ping when optimal dry window opens.`;
    } else if (windSpeed > 22 || (rainProb >= 20 && rainProb < 40)) {
      // Moderate caution
      advisoryCard.classList.add('risk-moderate');
      advisoryIcon.textContent = '💨 ⚡';
      advisoryHeadline.textContent = 'CAUTION — HIGH SPRAY DRIFT / MODERATE RISK';
      advisoryBody.textContent = `Wind speed is ${windSpeed} km/h with a ${rainProb}% rain chance. High wind causes severe droplet drift off-target and uneven foliar deposition.`;
      advisoryAction.innerHTML = `<strong>Action Required:</strong> Spray early morning (before 9 AM) using low-drift nozzles or precision drone with downward propeller wash.`;
    } else {
      // Safe to spray
      advisoryCard.classList.add('risk-safe');
      advisoryIcon.textContent = '☀️ ✅';
      advisoryHeadline.textContent = 'OPTIMAL WINDOW — SAFE TO SPRAY';
      advisoryBody.textContent = `Low rain risk (${rainProb}%) and calm winds (${windSpeed} km/h). Ideal conditions for full foliar systemic absorption of ${chemType}.`;
      advisoryAction.innerHTML = `<strong>Action Required:</strong> Proceed with field application. Need equipment? Tap <em>Machine + Crew</em> to book an agri-drone.`;
    }
  }

  if (rainSlider && windSlider && chemicalTypeSelect) {
    rainSlider.addEventListener('input', updateWeatherAdvisory);
    windSlider.addEventListener('input', updateWeatherAdvisory);
    chemicalTypeSelect.addEventListener('change', updateWeatherAdvisory);
    updateWeatherAdvisory();
  }

  /* ==========================================================================
     5. Vernacular Voice UI Simulation
     ========================================================================== */
  const voiceMicBtn = document.getElementById('voiceMicBtn');
  const micStatus = document.getElementById('micStatus');
  const voiceSampleBtns = document.querySelectorAll('.voice-sample-btn');
  const voiceOutputCard = document.getElementById('voiceOutputCard');
  const voiceQueryDisplay = document.getElementById('voiceQueryDisplay');
  const voiceResponseDisplay = document.getElementById('voiceResponseDisplay');
  const voiceActionDisplay = document.getElementById('voiceActionDisplay');

  const voiceLibrary = {
    'wheat-mandi': {
      query: '“गेहूं का आज का मंडी भाव क्या है?” (Wheat Mandi Rate)',
      response: '“आज आपके नजदीकी मंडी में गेहूं का मोडल भाव ₹2,425 प्रति क्विंटल है, जो कल से ₹35 ज्यादा है। जिला मंडी में भाव ₹2,520 है।”',
      action: 'Module 2: APMC Mandi Intelligence Active'
    },
    'book-tractor': {
      query: '“कल सुबह 4 एकड़ के लिए रोटावेटर चाहिए” (Book Rotavator)',
      response: '“कल सुबह 7 बजे के लिए 4 एकड़ रोटावेटर व ड्राइवर बुक किया जा सकता है। कुल दर ₹4,800 (₹1,200/एकड़ तय)। क्या बुकिंग पक्की करें?”',
      action: 'Module 1: On-Demand Machine + Crew Dispatch Staged'
    },
    'weather-spray': {
      query: '“क्या आज कीटनाशक का छिड़काव कर सकते हैं?” (Spray Advisory)',
      response: '“चेतावनी! अगले 8 घंटों में 65% बारिश की संभावना है। अभी कीटनाशक का छिड़काव न करें, दवा धुल जाएगी। परसों सुबह मौसम साफ रहेगा।”',
      action: 'Module 3: 12-Hour Micro-Weather Alert Triggered'
    }
  };

  function triggerVoiceSimulation(key) {
    const item = voiceLibrary[key];
    if (!item) return;

    voiceMicBtn.classList.add('listening');
    micStatus.textContent = 'Listening to voice query and analyzing dialect...';

    setTimeout(() => {
      voiceMicBtn.classList.remove('listening');
      micStatus.textContent = 'Audio guidance response generated:';
      voiceOutputCard.classList.remove('hidden');
      voiceQueryDisplay.textContent = item.query;
      voiceResponseDisplay.textContent = item.response;
      voiceActionDisplay.textContent = item.action;

      // Optional Browser Speech Synthesis (if supported and enabled)
      if ('speechSynthesis' in window) {
        try {
          const cleanText = item.response.replace(/[“”—]/g, '');
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = 'hi-IN';
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          // Fallback gracefully without error
        }
      }
    }, 600);
  }

  voiceSampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const queryKey = btn.dataset.query;
      triggerVoiceSimulation(queryKey);
    });
  });

  if (voiceMicBtn) {
    voiceMicBtn.addEventListener('click', () => {
      // Cycle through one of the sample queries
      const keys = Object.keys(voiceLibrary);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      triggerVoiceSimulation(randomKey);
    });
  }

  /* ==========================================================================
     6. Smooth Scroll Spy for Navigation Links
     ========================================================================== */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

});
