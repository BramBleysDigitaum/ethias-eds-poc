import {createOptimizedPicture} from '../../scripts/aem.js';
import {moveInstrumentation} from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else if (div.children.length === 1 && div.querySelector('p')) {
        div.children[0].textContent.split(',').forEach((className) => block.classList.add(className.trim()));
        div.remove();
      } else if (div.querySelector('pre')) {
        const legal = document.createElement('p');
        const pre = div.querySelector('pre');
        legal.textContent = pre.textContent;
        legal.className = "legal-info";
        pre.replaceWith(legal);
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{width: '750'}]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
