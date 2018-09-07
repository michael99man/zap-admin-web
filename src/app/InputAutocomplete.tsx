import * as React from 'react';
import './inputAutocomplete.css';

interface Option {
  name: string;
  value: string;
}

interface Props {
  value: string;
  options: Array<Option>;
  onSelect?: (e: string) => any;
  onChange: (e: string) => any;
  onBlur?: (e: string) => any;
  placehoder?: string;
  disabled?: boolean;
}

interface State {
  open: boolean;
  index: number;
}

export class InputAutocomplete extends React.PureComponent<Props, State> {

  timeout;

  constructor(props) {
    super(props);
    this.state = {
      index: -1,
      open: false,
    }
    this.openDropdown = this.openDropdown.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  static getFilteredOptions(value, options) {
    if (!value || !value.trim()) return options;
    const search = value.toLowerCase();
    return options.filter(option =>
      option.value.toLowerCase().indexOf(search) !== -1
      || option.name.toLowerCase().indexOf(value) !== -1);
  }

  openDropdown() {
    this.setState({ open: true });
  }

  closeDropdown(delay = 0) {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const state = { open: false };
      this.setState(state);
    }, delay);
  }

  handleDropdownSelect(value) {
    this.setState({
      open: false,
      index: -1,
    });
    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onSelect) this.props.onSelect(value);
  }

  getIndex(mod, options) {
    const nextIndex = this.state.index + mod;
    if (nextIndex > options.length - 1) return 0;
    if (nextIndex < 0 ) return options.length - 1;
    return nextIndex;
  }

  handleInputChange(e) {
    const value = e.target.value;
    this.setState({
      index: 0,
      open: !!value.trim(),
    });
    if (this.props.onChange) this.props.onChange(value);
  }

  handleBlur() {
    this.closeDropdown(200);
    const {onBlur, value} = this.props;
    if (onBlur) onBlur(value);
  }

  handleKeyDown(e, options) {
    switch (e.key) {
      case 'ArrowDown':
        this.setState({open: true, index: this.state.open ? this.getIndex(1, options) : 0});
        break;
      case 'ArrowUp':
        if (this.state.open) this.setState({index: this.getIndex(-1, options)});
        break;
      case 'Enter':
        e.preventDefault();
        if (options[this.state.index]) {
          this.handleDropdownSelect(options[this.state.index].value);
        }
        break;
      case 'Escape':
        this.closeDropdown();
        break;
    }
  }

  render() {
    const {options, placehoder, disabled, value} = this.props;
    const {open, index} = this.state;
    // const value = !!onChange ? this.props.value : this.state.value;
    const filteredOptions = InputAutocomplete.getFilteredOptions(value, options);
    return (
      <div className="input-autocomplete__wrapper">
        {!!value && <a className="input-autocomplete__close" onClick={() => {this.handleDropdownSelect('')}} >&times;</a>}
        <input
          disabled={disabled}
          placeholder={placehoder}
          className="input-autocomplete"
          value={value}
          onKeyDown={e => {this.handleKeyDown(e, filteredOptions)}}
          onClick={this.openDropdown}
          onBlur={this.handleBlur}
          onChange={this.handleInputChange} type="text"/>

        {open && !!filteredOptions.length &&
          <InputAutocompleteDropdown
            index={index}
            options={filteredOptions}
            onSelect={this.handleDropdownSelect} />
        }
      </div>
    );
  }
}

const InputAutocompleteDropdown = ({options, index, onSelect}) => (
  <div className="input-autocomplete__dropdown">
    {options.map((option: Option, i) =>
      <div key={'' + option.value + option.name} className={index === i ? 'active' : undefined} onClick={() => {onSelect(option.value)}}>
        {option.name}
      </div>
    )}
  </div>
);
