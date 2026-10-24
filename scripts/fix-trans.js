const fs = require('fs');
const en = JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8'));
const rw = JSON.parse(fs.readFileSync('src/i18n/locales/rw.json', 'utf8'));

en.common.submitSuccessTitle = 'Message sent successfully';
en.common.submitSuccessBody = "Thank you {{name}}. We've received your enquiry and will get back to you shortly to discuss your project.";
en.common.sendAnother = 'Send another message';

rw.common.submitSuccessTitle = 'Ubutumwa bwoherejwe neza';
rw.common.submitSuccessBody = 'Murakoze {{name}}. Twakiriye icyifuzo cyawe, tuzabavugisha vuba kugira ngo tuganire ku mushinga wanyu.';
rw.common.sendAnother = 'Ohereza ubundi ubutumwa';

rw.quote.form.successBody = 'Murakoze {{name}}. Twakiriye icyifuzo cyawe kandi tuzabavugisha vuba.';
en.quote.form.successBody = "Thank you {{name}}. We've received your request and will get back to you shortly with your quotation details.";

en.common.notConfiguredTitle = 'Quick way to reach us';
en.common.notConfiguredBody = 'Online form is temporarily unavailable. Reach us directly by phone or WhatsApp and we will respond right away.';
rw.common.notConfiguredTitle = 'Uburyo bwihuse bwo kutwandikira';
rw.common.notConfiguredBody = 'Ifishi ntibakoreshwa ubu. Mutwandikire kuri telefoni cyangwa WhatsApp, tuzabasubiza ako kanya.';

fs.writeFileSync('src/i18n/locales/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('src/i18n/locales/rw.json', JSON.stringify(rw, null, 2) + '\n');
console.log('ok');

