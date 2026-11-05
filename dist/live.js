'use strict';

const signed = document.getElementById('signed');
const complete = document.getElementById('complete');
const duplicate = document.getElementById('duplicate');
const approve = document.getElementById('approve');
const form = document.getElementById('review-form');
const fee = 12000;
const base = 48000;
const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0
});
let added = false;

function status() {
  if (duplicate.checked) return ['Exclude the duplicate', 'Nina found CO-02 in invoice history. Keep the survey off this draft.'];
  if (!signed.checked && !complete.checked) return ['Hold for two checks', 'Leah needs signed customer approval and Mira needs to verify delivery against the field report.'];
  if (!signed.checked) return ['Hold for Sales', 'Leah must verify the signed $12,000 change order before Finance can add the survey.'];
  if (!complete.checked) return ['Hold for Operations', 'Mira must verify completion against Marcus’s field report before Finance can add the survey.'];
  if (added) return ['Finance approved the line', 'The draft now includes CO-02. The invoice is ready for final review.'];
  return ['Ready for Finance review', 'Nina can add the survey. Approval and delivery match CO-02, and it is absent from earlier invoices.'];
}

function canAdd() {
  return signed.checked && complete.checked && !duplicate.checked && !added;
}

function render() {
  const [title, reason] = status();
  document.getElementById('review-status').textContent = title;
  document.getElementById('review-reason').textContent = reason;
  let lineValue = 'Missing from draft';
  if (added) lineValue = dollars.format(fee);
  else if (duplicate.checked) lineValue = 'Previously billed';
  else if (!signed.checked || !complete.checked) lineValue = 'Held for verification';
  document.getElementById('line-value').textContent = lineValue;
  document.getElementById('total').textContent = dollars.format(base + (added ? fee : 0));
  approve.disabled = !canAdd();
  approve.textContent = added ? 'Line added to draft' : 'Add $12,000 to draft';
}

form.addEventListener('change', () => {
  added = false;
  render();
});
approve.addEventListener('click', () => {
  if (!canAdd()) return;
  added = true;
  render();
});
document.getElementById('reset-example').addEventListener('click', () => {
  form.reset();
  added = false;
  render();
});
render();
