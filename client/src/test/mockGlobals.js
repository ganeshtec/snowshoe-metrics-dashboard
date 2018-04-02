export default () => {
    global.LoaderBtn = {
        create: () => {
            return {
                start: () => { },
                stop: () => { }
            };
        }
    };
    global.CheckboxGroup = () => { };
    global.CheckboxGroup.prototype.init = function () { };
    global.RadioGroup = function () { };
    global.RadioGroup.prototype.init = function () { };
    global.Accordion = () => { };
    global.Accordion.prototype.init = function () { };
    global.TabList = () => { };
    global.TabList.prototype.init = function () { };
    global.Table = () => { };
    global.Table.prototype.init = function () { };
    global.FilterTable = () => { };
    global.FilterTable.prototype.init = function () { };
    global.DropdownList = () => { };
    global.DropdownList.prototype.init = function () { };
    global.CounterInput = () => { };
    global.CounterInput.prototype.init = function () { };
    global.DatePicker = () => { };
    global.DatePicker.prototype.init = function () { };
    global.Modal = () => { };
    global.Modal.prototype.init = function () { };

};