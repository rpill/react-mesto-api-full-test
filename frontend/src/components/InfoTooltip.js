import React from 'react';
import SuccessIcon from '../images/success-icon.svg';
import ErrorIcon from '../images/error-icon.svg';

function InfoTooltip({ isOpen, onClose, status }) {
  return (
    <div className={`popup ${isOpen && 'popup_is-opened'}`}>
      <div className="popup__content">
        <form className="popup__form" noValidate>
          <button type="button" className="popup__close" onClick={onClose}></button>
            {status === 'success' ?
            <div>
              <img className="popup__icon" src={SuccessIcon} alt=""/>
              <p className="popup__status-message">Вы успешно зарегистрировались</p>
            </div>
            :
            <div>
              <img className="popup__icon" src={ErrorIcon} alt=""/>
              <p className="popup__status-message">Что-то пошло не так!<br />
              Попробуйте ещё раз.</p>
            </div>
            }
        </form>
      </div>
    </div>
  );
}

export default InfoTooltip;

