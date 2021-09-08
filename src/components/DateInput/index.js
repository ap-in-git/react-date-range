import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { format, parse, isValid, isEqual } from 'date-fns';

class DateInput extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      invalid: false,
      changed: false,
      value: this.formatDate(props),
    };
  }

  componentDidUpdate(prevProps) {
    const { value } = prevProps;

    if (!isEqual(value, this.props.value)) {
      this.setState({ value: this.formatDate(this.props) });
    }
  }

  formatDate({ value, dateDisplayFormat, dateOptions }) {
    if (value && isValid(value)) {
      return format(value, dateDisplayFormat, dateOptions);
    }
    return '';
  }

  update(value) {
    const { invalid, changed } = this.state;

    if (invalid || !changed || !value) {
      return;
    }

    const { onChange, dateDisplayFormat, dateOptions } = this.props;
    const parsed = parse(value, dateDisplayFormat, new Date(), dateOptions);

    if (isValid(parsed)) {
      this.setState({ changed: false }, () => onChange(parsed));
    } else {
      this.setState({ invalid: true });
    }
  }

  onKeyDown = e => {
    const { value } = this.state;

    if (e.key === 'Enter') {
      this.update(value);
    }
  };

  onChange = e => {
    this.setState({ value: e.target.value, changed: true, invalid: false });
  };

  onBlur = () => {
    const { value } = this.state;
    this.update(value);
  };

  getHour = () => {
    const { value } = this.props;
    if (!value) {
      return '';
    }
    let time = '';
    if (parseInt(value.getHours()) < 10){
      time = '0' + value.getHours();
    } else {
      time = value.getHours();
    }
    time = time + ':';

    if (value.getMinutes() < 10){
      time = `${time}0${value.getMinutes()}`;
    } else {
      time = time + value.getMinutes();
    }
    return time;
  };

  handleHourChange = (e) => {

    this.props.handleHourChange({
      hour: e.target.value,
      isEnd: this.props.isEnd,
    });

    // console.log(this.props.ha)
    // console.log(this.props.hand)

    // const { onChange, dateDisplayFormat, dateOptions } = this.props;
    // const { value } = this.state;
    //
    // const hour = e.target.value;
    //
    // const hourFormat = dateDisplayFormat + ' HH:mm';
    //
    // const finalValue = value + ' ' + hour;
    // const parsed = parse(finalValue, hourFormat, new Date(), dateOptions);
    //
    // if (isValid(parsed)) {
    //   this.setState({ invalid: false }, () => onChange(parsed));
    // } else {
    //   this.setState({ invalid: true });
    // }
  };

  render() {
    const { className, readOnly, placeholder, ariaLabel, hour,disabled, onFocus,showTimePicker } = this.props;
    const { value, invalid } = this.state;

    return (
      <div className={classnames('rdrDateInput', className)} style={{ display: 'flex' , width:"100%" }}>
        <input
          // readOnly={readOnly}
          // disabled={disabled}
          value={value}
          placeholder={placeholder}
          aria-label={ariaLabel}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={onFocus}
        />
        <input type={'time'} className={'timePicker'} value={hour} onChange={this.handleHourChange} />
        {invalid && <span className="rdrWarning">&#9888;</span>}
      </div>
    );
  }
}

DateInput.propTypes = {
  value: PropTypes.object,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  dateOptions: PropTypes.object,
  dateDisplayFormat: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  showTimePicker: PropTypes.bool,
  isEnd: PropTypes.bool,
  hour: PropTypes.string,
  handleHourChange: PropTypes.func,
};

DateInput.defaultProps = {
  readOnly: true,
  disabled: false,
  dateDisplayFormat: 'MMM D, YYYY',
};

export default DateInput;
