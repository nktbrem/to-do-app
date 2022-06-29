'use strict';

!(function () {

    function createElement({ tagName = 'div', classes = [], attributes = {}, textContent = '' }) {
        if (typeof tagName !== 'string') {
            console.warn('tagName createElement method of App must be string');
            return document.createElement('div');
        }

        let element = document.createElement(tagName);

        //check if classes is an array
        if (Array.isArray(classes)) {
            classes.forEach(className => {
                //check if classes elements are strings
                if (typeof className === 'string') {
                    element.classList.add(className);
                } else {
                    console.warn('classes element of App createElement method must be string');
                }
            })
        }

        if (typeof attributes === 'object' && attributes) {
            //Object.keys(attributes) returns array of keys []
            //Object.values(attributes) returns array of values []
            //Object.entries(attributes) returns arrays for every key - value pair []
            Object.entries(attributes).forEach(pair => {
                if (typeof pair[0] === 'string' || typeof pair[1] === 'string') {
                    element.setAttribute(pair[0], pair[1]);
                } else {
                    console.warn('attributes element of App createElement method must be string');
                }
            })
        }

        if (typeof textContent == 'string') {
            element.textContent = textContent;
        } else {
            console.warn('textContent element of App createElement method must be string');
        }

        return element
    }

    class App {
        constructor() {
            this.cardsArr = [];
            this._LS = localStorage;
            this._body = document.querySelector('body');

            this._init();
        }

        _init() {
            this._createApp();
            this._getCards();
            this._attachEvents();
        }

        _attachEvents() {
            this.formButton.addEventListener('click', () => {
                //arrow function deosn't have own 'this' it will inherit it from it's parent App
                //another option  formButton.addEventListener('click', this._formAction.bind(this))
                this._formAction()
            });
        }

        _createApp() {
            let appBlock = createElement({ classes: ['container'] });
            // classes: ['btn', 'btn-primary'], textContent: 'Create card' 
            this.formButton = createElement({ tagName: 'button', classes: ['button', 'button-create'], attributes: { 'data-role': 'create' } });
            this.formButton.innerHTML = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0C16.8954 0 16 0.895431 16 2V16H2C0.895431 16 0 16.8954 0 18C0 19.1046 0.895431 20 2 20H16V34C16 35.1046 16.8954 36 18 36C19.1046 36 20 35.1046 20 34V20H34C35.1046 20 36 19.1046 36 18C36 16.8954 35.1046 16 34 16H20V2C20 0.895431 19.1046 0 18 0Z" fill="black"/>
            </svg>`;
            let title = createElement({ tagName: 'h1', classes: ['title'], textContent: 'to-do by brm' });

            this._nameField = createElement({ tagName: 'input', classes: ['form-control', 'name-input'], attributes: { placeholder: 'Name' } });
            this._cardsContainer = createElement({ classes: ['container'] });
            let cardCreateContainer = createElement({ classes: ['card-create-container'] });

            cardCreateContainer.append(this._nameField, this.formButton);
            appBlock.append(title, cardCreateContainer, this._cardsContainer);
            this._body.append(appBlock);

        }

        //Read
        _getCards() {
            let cardsJSON = this._LS.getItem('cards');
            if (cardsJSON) {
                let cardsData = JSON.parse(cardsJSON);
                this.cardsArr = cardsData.map(cardData => {
                    return new Card({ cardTitle: cardData.title, isImportant: cardData.importance })
                });

                this.cardsArr.forEach(card => {
                    this._cardsContainer.append(card.element);
                })
            }
        }

        _getFormData() {

            let cardData = {};
            cardData.cardTitle = this._nameField.value;
            return cardData;

        }

        _validateForm() {
            if (this._nameField.value === '') {
                this._nameField.classList.add('is-invalid');
                return false;
            } else return true
        }

        _formAction() {
            if (!this._validateForm()) {
                return
            }
            if (this.formButton.dataset.role === 'create') {
                let cardData = this._getFormData();
                let card = new Card(cardData);
                this.cardsArr.push(card);
                this._cardsContainer.append(card.element);
            } else if (this.formButton.dataset.role === 'update') {
                this.editableCard.title = this._nameField.value;
                this.editableCard._updateCard();
            }
            this._updateLS()
            this._resetForm();
        }

        _resetForm() {
            this._nameField.value = '';
            this.formButton.innerHTML = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0C16.8954 0 16 0.895431 16 2V16H2C0.895431 16 0 16.8954 0 18C0 19.1046 0.895431 20 2 20H16V34C16 35.1046 16.8954 36 18 36C19.1046 36 20 35.1046 20 34V20H34C35.1046 20 36 19.1046 36 18C36 16.8954 35.1046 16 34 16H20V2C20 0.895431 19.1046 0 18 0Z" fill="black"/>
            </svg>`;
            this.formButton.setAttribute('data-role', 'create');
        }

        _updateLS() {

            //map() creates a new array populated with the results of calling a provided function on every element in the calling array
            let cardsStates = this.cardsArr.map(card => {
                return {
                    title: card.title,
                    importance: card.isImportant,
                }
            })

            this._LS.setItem('cards', JSON.stringify(cardsStates));
        }


        deleteCard(card) {

            //Alternative
            // this.cardsArr.forEach((appCard, index) => {
            //     if (card === appCard) {
            //         this.cardsArr.splice(index, 1);
            //     }
            // })


            this.cardsArr = this.cardsArr.filter(appCard => {
                return card !== appCard;
            })

            this._updateLS();
            console.log(app);
        }

        updateCard(card, importanceChange) {
            if (importanceChange) {
                this._updateLS();
                return;
            }

            this._nameField.value = card.title;
            this.formButton.innerHTML = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.56721 17.5128C4.56721 24.8184 9.86401 29.796 15.8136 30.8256C15.9754 30.8537 16.1302 30.9133 16.269 31.0012C16.4078 31.089 16.5279 31.2033 16.6225 31.3376C16.7171 31.4719 16.7843 31.6235 16.8203 31.7837C16.8564 31.944 16.8605 32.1098 16.8324 32.2716C16.8044 32.4334 16.7447 32.5882 16.6569 32.727C16.569 32.8658 16.4547 32.9859 16.3204 33.0805C16.1861 33.1751 16.0345 33.2423 15.8743 33.2783C15.714 33.3144 15.5482 33.3185 15.3864 33.2904C8.40001 32.0808 2.06641 26.1912 2.06641 17.5128C2.06641 13.824 3.74401 10.9248 5.70241 8.72161C7.10641 7.14241 8.71201 5.85841 10.0032 4.87681H6.07681C5.75855 4.87681 5.45332 4.75038 5.22828 4.52533C5.00323 4.30029 4.87681 3.99507 4.87681 3.67681C4.87681 3.35855 5.00323 3.05332 5.22828 2.82828C5.45332 2.60324 5.75855 2.47681 6.07681 2.47681H13.2768C13.5951 2.47681 13.9003 2.60324 14.1253 2.82828C14.3504 3.05332 14.4768 3.35855 14.4768 3.67681V10.8768C14.4768 11.1951 14.3504 11.5003 14.1253 11.7253C13.9003 11.9504 13.5951 12.0768 13.2768 12.0768C12.9585 12.0768 12.6533 11.9504 12.4283 11.7253C12.2032 11.5003 12.0768 11.1951 12.0768 10.8768V6.44641L12.0744 6.45121C10.7016 7.48321 9.02641 8.74801 7.57441 10.3824C5.85841 12.312 4.56721 14.6448 4.56721 17.5104V17.5128ZM31.2264 18.4872C31.2264 11.2584 26.0424 6.31201 20.1696 5.20801C20.0059 5.18023 19.8494 5.12014 19.7092 5.03124C19.569 4.94234 19.4479 4.8264 19.353 4.69019C19.258 4.55399 19.1912 4.40024 19.1563 4.23793C19.1214 4.07561 19.1192 3.90797 19.1498 3.74479C19.1804 3.58161 19.2432 3.42616 19.3345 3.2875C19.4258 3.14885 19.5438 3.02976 19.6816 2.9372C19.8195 2.84464 19.9743 2.78045 20.1372 2.74838C20.3001 2.71631 20.4678 2.717 20.6304 2.75041C27.528 4.04641 33.7272 9.90241 33.7272 18.4872C33.7272 22.176 32.0496 25.0728 30.0912 27.2784C28.6872 28.8576 27.0816 30.1416 25.7904 31.1232H29.7168C30.0351 31.1232 30.3403 31.2496 30.5653 31.4747C30.7904 31.6997 30.9168 32.0049 30.9168 32.3232C30.9168 32.6415 30.7904 32.9467 30.5653 33.1717C30.3403 33.3968 30.0351 33.5232 29.7168 33.5232H22.5168C22.1985 33.5232 21.8933 33.3968 21.6683 33.1717C21.4432 32.9467 21.3168 32.6415 21.3168 32.3232V25.1232C21.3168 24.8049 21.4432 24.4997 21.6683 24.2747C21.8933 24.0496 22.1985 23.9232 22.5168 23.9232C22.8351 23.9232 23.1403 24.0496 23.3653 24.2747C23.5904 24.4997 23.7168 24.8049 23.7168 25.1232V29.5512H23.7216C25.092 28.5144 26.7696 27.252 28.2192 25.6152C29.9352 23.688 31.2264 21.3552 31.2264 18.4872Z" fill="black"/>
            </svg>`;
            this.formButton.setAttribute('data-role', 'update');

            this.editableCard = card;
        }
    }


    class Card {
        constructor({ cardTitle = '', isImportant = false }) {
            this.title = cardTitle;
            this.isImportant = isImportant;

            this._init();
        }

        _init() {
            this.element = this._createElement();
            this._attachEvents();
        }

        _createElement() {
            let cardElement = createElement({ classes: ['card'] });
            this._titleElement = createElement({ tagName: 'h5', classes: ['card-title'], textContent: this.title });

            let controlsContainer = createElement({ classes: ['controls-container'] });;

            this._editButton = createElement({ tagName: 'button', classes: ['button'], textContent: 'Edit' });
            this._editButton.innerHTML = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M31.4544 1.93943C30.8692 1.3535 29.9211 1.35355 29.3361 1.93941L29.3361 1.93943L27.5724 3.70567L31.8074 7.9468L33.5696 6.18209C34.1552 5.59556 34.1552 4.64418 33.5696 4.05768L31.4544 1.93944L31.4544 1.93943ZM28.2747 0.879531C29.4457 -0.293202 31.3447 -0.293153 32.5158 0.879534L34.631 2.99779C35.8014 4.16992 35.8014 6.06984 34.631 7.24197L32.8665 9.00898L32.3381 9.53817L32.3365 9.53969L31.8074 10.0696L18.5686 23.3275L18.0943 23.8025C18.0067 23.9123 17.8874 23.9987 17.7443 24.046L11.204 26.2106C10.2573 26.5239 9.34361 25.6547 9.60746 24.6918L11.488 17.8287C11.5266 17.6879 11.6028 17.5674 11.7028 17.4753L12.2139 16.9635L25.4526 3.70567L25.9818 3.17573L25.9818 3.17572L26.5117 2.64502L28.2747 0.879546L28.2747 0.879531ZM12.8218 18.6337L11.1763 24.6388L16.92 22.7379L12.8218 18.6337ZM13.8037 17.4942L26.5117 4.76787L30.7467 9.00898L18.0387 21.7353L13.8037 17.4942ZM5.75 4.00592C2.57437 4.00592 0 6.58029 0 9.75592V29.7559C0 32.9315 2.57435 35.5059 5.75 35.5059H25.7067C28.8823 35.5059 31.4567 32.9315 31.4567 29.7559V19.7559C31.4567 19.3417 31.1209 19.0059 30.7067 19.0059C30.2925 19.0059 29.9567 19.3417 29.9567 19.7559V29.7559C29.9567 32.1031 28.0539 34.0059 25.7067 34.0059H5.75C3.40279 34.0059 1.5 32.1031 1.5 29.7559V9.75592C1.5 7.40871 3.40279 5.50592 5.75 5.50592H15.7283C16.1425 5.50592 16.4783 5.17013 16.4783 4.75592C16.4783 4.34171 16.1425 4.00592 15.7283 4.00592H5.75Z" fill="black"/>
            </svg>`;
            this._deleteButton = createElement({ tagName: 'button', classes: ['button'], textContent: 'Delete' });
            this._deleteButton.innerHTML = `<svg width="29" height="36" viewBox="0 0 29 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.89285 3.71428C7.89285 2.1955 9.12407 0.964283 10.6429 0.964283H18.8571C20.3759 0.964283 21.6071 2.1955 21.6071 3.71428V4.76785H26.4554C27.8607 4.76785 29 5.90713 29 7.3125C29 8.28597 28.4534 9.13177 27.6503 9.55969L25.59 31.6342C25.4101 33.5619 23.7923 35.0357 21.8562 35.0357H7.64374C5.70768 35.0357 4.08989 33.5619 3.90997 31.6342L1.84968 9.55968C1.04663 9.13176 0.5 8.28597 0.5 7.3125C0.5 5.90713 1.63928 4.76785 3.04464 4.76785H7.89285V3.71428ZM20.1071 3.71428V4.76785H9.39285V3.71428C9.39285 3.02393 9.9525 2.46428 10.6429 2.46428H18.8571C19.5475 2.46428 20.1071 3.02393 20.1071 3.71428ZM3.04464 6.26785H26.4554C27.0323 6.26785 27.5 6.73556 27.5 7.3125C27.5 7.88944 27.0323 8.35714 26.4554 8.35714H3.04464C2.4677 8.35714 2 7.88944 2 7.3125C2 6.73556 2.4677 6.26785 3.04464 6.26785ZM3.38397 9.85714L5.40348 31.4948C5.51143 32.6514 6.48211 33.5357 7.64374 33.5357H21.8562C23.0179 33.5357 23.9886 32.6514 24.0965 31.4948L26.116 9.85714H3.38397ZM14.7366 11.8929C14.3224 11.8929 13.9866 12.2286 13.9866 12.6429V30.4821C13.9866 30.8964 14.3224 31.2321 14.7366 31.2321H14.7634C15.1776 31.2321 15.5134 30.8964 15.5134 30.4821V12.6429C15.5134 12.2286 15.1776 11.8929 14.7634 11.8929H14.7366ZM6.95129 12.7715C6.90799 12.3596 7.20684 11.9905 7.61879 11.9472L7.64543 11.9444C8.05737 11.9011 8.42642 12.2 8.46971 12.6119L10.3344 30.3535C10.3777 30.7654 10.0789 31.1345 9.66693 31.1778L9.64029 31.1806C9.22835 31.2239 8.8593 30.925 8.816 30.5131L6.95129 12.7715ZM21.8546 11.9444C21.4426 11.9011 21.0736 12.2 21.0303 12.6119L19.1656 30.3535C19.1223 30.7654 19.4211 31.1345 19.8331 31.1778L19.8597 31.1806C20.2717 31.2239 20.6407 30.925 20.684 30.5131L22.5487 12.7715C22.592 12.3596 22.2932 11.9905 21.8812 11.9472L21.8546 11.9444Z" fill="black"/>
            </svg>`;
            this._importanceCheckbox = createElement({ tagName: 'input', classes: ['checkbox'], attributes: { type: 'checkbox', id: 'importanceCheckbox' } });
            if (this.isImportant) {
                this._importanceCheckbox.setAttribute('checked', 'checked');
                cardElement.classList.add('card--important');
            } else {
                cardElement.classList.remove('card--important');
            }

            let importanceCheckboxLabel = createElement({ tagName: 'label', classes: ['form-check-label'], textContent: 'Important', attributes: { for: 'importanceCheckbox' } });
            // this._importanceCheckboxLabel.innerHTML = `<svg width="10" height="36" viewBox="0 0 10 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            // <path class = "checkbox-label" d="M5 0C2.3136 0 0.205755 2.30442 0.444662 4.98019L2.27767 25.5099C2.40354 26.9196 3.58472 28 5 28C6.41529 28 7.59647 26.9196 7.72233 25.5099L9.55534 4.98019C9.79425 2.30443 7.68641 0 5 0ZM5 36C6.65686 36 8 34.6569 8 33C8 31.3431 6.65686 30 5 30C3.34315 30 2 31.3431 2 33C2 34.6569 3.34315 36 5 36Z" fill="black"/>
            // </svg>`;

            controlsContainer.append(this._editButton, this._deleteButton, this._importanceCheckbox, importanceCheckboxLabel);
            cardElement.append(this._titleElement, controlsContainer);

            return cardElement;
        }

        _attachEvents() {
            this._deleteButton.addEventListener('click', () => {
                this._deleteCard();
            })
            this._editButton.addEventListener('click', () => {
                app.updateCard(this);
            })
            this._importanceCheckbox.addEventListener('change', () => {
                this.isImportant = this._importanceCheckbox.checked;
                app.updateCard(this, true);
                if (this.isImportant) {
                    this.element.classList.add('card--important');
                } else {
                    this.element.classList.add('card--important');
                }
            })
        }

        _deleteCard() {
            this.element.remove();
            app.deleteCard(this);

        }

        _updateCard() {
            this._titleElement.innerText = this.title;
        }
    }


    let app = new App();
 

}());