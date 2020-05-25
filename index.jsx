/* eslint-disable */
import {
    Button,
    Grid,
    Tooltip
} from '@material-ui/core';
/* eslint-disable no-use-before-define */
import React, {
    useEffect,
    useState
} from 'react';

import CheckIcon from '@material-ui/icons/Check';
import Checkbox from '@material-ui/core/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import _ from 'lodash';
import customstyles from './styles.css';
import styled from 'styled-components';
import useAutocomplete from './useAutocomplete';

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled('div')`
  border: 0px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;
  height: '46px';

  &:hover {
    border-color: #40a9ff;
  }

  &.focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    font-size: 14px;
    ${'' /* width:360px; */}
    height: 30px;
    box-sizing: border-box;
    margin: 6px 0px 6px 6px;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    outline: 0;
  }
`;

const Tag = styled(({ label, onDelete, ...props }) => (
    <Grid { ...props } >
        <label>{ label }</label>
        <CloseIcon onClick={ onDelete } />
    </Grid>
))`
  display: flex;
  align-items: center;
  min-width: 50px;
  height: 28px;
  margin: 0 0px 10px 10px;
  border: 0px solid #e8e8e8;
  border-radius: 3px;
  background-color: rgba(27,26,26,1);
  box-sizing: content-box;
  padding: 2px 0px 2px 10px;
  outline: 0;
  overflow: hidden;
  color: rgba(101,101,101,1);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 21px;
  position:relative;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    right:0;
  }
`;

const Listbox = styled('ul')`
  margin: 2px 0 0;
  padding: 0 0 25px 0;
  position: absolute;
  list-style: none;
  overflow: auto;
  max-height: 250px;
  border-radius: 0px;
  height: 400px;
  width: 100%;
  background-color: rgba(255,255,255,1);
  box-shadow: 0 15px 24px 0 rgba(0,0,0,0.07);
  z-index: 1;

  & li {
    padding: 7px 14px;
    display: flex;
    margin: 6px 16px;
    border-radius: 2px;
    ${'' /* background-color: rgba(245,245,245,1); */}

    & span {
      flex-grow: 1;
      color: rgba(44,44,44,1);
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0;
      line-height: 21px;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected="true"] {
    border-radius: 2px;
    background-color: rgba(245,245,245,1);
    font-weight: 600;
    margin: 6px 18px;

    & svg {
      color: rgba(97,97,97,1);
    }
  }

  & li[data-focus="true"] {
    background-color: rgba(245,245,245,1);
    cursor: pointer;
  }
`;


const styles = {
    title: {
        fontSize: '12px'
    }
};

export default function CustomizedHook({ title, inputVal, options, onChange, onSearchTextChange = undefined }) {
    const [ listOptions, setListOptions ] = useState(options);

    useEffect(() => {
        setListOptions(options);
    }, [ options ]);

    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        popupOpen,
        value,
        focused,
        setValue,
        setAnchorEl
    } = useAutocomplete({
        id: 'customized-hook-demo',
        multiple: true,
        disableCloseOnSelect: true,
        defaultValue: inputVal,
        options: listOptions,
        getOptionSelected: (_opt, _val) => _opt.id === _val.id,
        onChange: onChange,
        getOptionLabel: option => option.title
    });


    useEffect(() => {
        setValue(inputVal);
    }, [ inputVal ]);


    const handleChange = event => {
    // setValue(event.target.checked? options: []);
        onChange(null, event.target.checked ? groupedOptions : []);
    };

    return (
        <NoSsr>
            <div className="multiSelectComboWrapper">
                <div { ...getRootProps() } className="autoComplete">
                    <label { ...getInputLabelProps() } className="title">{ title }</label>
                    <InputWrapper ref={ setAnchorEl } className={ focused ? 'focused multiSelectCombo' : 'multiSelectCombo' }>
                        <Grid item container alignItems="flex-start" xs={ 12 } style={ { maxHeight: '298px', overflow: 'auto' } }>
                            <Grid item container direction="row">
                                <div>
                                    <input { ...getInputProps() } placeholder={ 'Select' } style={ { width: 350 } } onChange={ (e) => {
                                        if(_.isEmpty(listOptions) && onSearchTextChange && !_.isEmpty(e.target.value)) {
                                            onSearchTextChange(e.target.value);
                                        }else if(onSearchTextChange) {
                                            onSearchTextChange('');
                                        }
                                        getInputProps().onChange(e);
                                    }

                                    } />
                                </div>
                                <Button onClick={ () => {getInputProps().onMouseDown();} } style={ { marginLeft: 'auto', minWidth: 44, paddingTop: 10 } }>
                                    <ExpandMoreIcon />
                                </Button>
                            </Grid>
                            { groupedOptions.length > 0 &&
                                <Grid item container alignItems="flex-start" xs={ 12 }>
                                    <div className="selectAll">
                                        <Checkbox
                                            inputProps={ { 'aria-label': 'uncontrolled-checkbox' } }
                                            color={ 'default' }
                                            checked={ options.length === value.length }
                                            onChange={ handleChange }
                                        />
                                        <label style={ { color: 'black' } }>Select All</label>
                                    </div>
                                </Grid>
                            }
                            { value.map((option, index) => (
                                <Tag label={ option.title } { ...getTagProps({ index }) } />
                            )) }
                        </Grid>
                    </InputWrapper>
                </div>
                <div className="multiSelectComboList">
                    { groupedOptions.length > 0 ? (
                        <Listbox { ...getListboxProps() }>
                            { groupedOptions.map((option, index) => {
                              if(option.toolTip) {
                                return(
                                  (<Tooltip placement="right" arrow title={option.toolTip}>
                                  <li { ...getOptionProps({ option, index }) }>
                                      <span style={ {} }>{ option.title }</span>
                                      <CheckIcon fontSize="small" />
                                  </li>
                                </Tooltip>)
                                )
                              }
                              return(
                                <li { ...getOptionProps({ option, index }) }>
                                      <span style={ {} }>{ option.title }</span>
                                      <CheckIcon fontSize="small" />
                                  </li>
                              )
                            }) }
                        </Listbox>
                    ) : null }
                </div>
            </div>
        </NoSsr>
    );
}

