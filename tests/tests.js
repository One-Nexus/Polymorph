import assert from 'assert';
import jsdom from 'jsdom-global';
import polymorph from '../src/polymorph';

jsdom();

describe('Polymorph function', () => {
    afterEach('clean the document', () => {
        document.body.innerHTML = '';
    });

    it('should exist', () => {
        assert.equal(typeof polymorph, 'function');
    });

    describe('when invoked with `styles` as an Object', () => {
        beforeEach('setup DOM elements', () => {
            document.body.innerHTML = (`
                <div class="foo" id="SVRNE"></div>
            `);

            polymorph(document.getElementById('SVRNE'), {
                'position': 'relative'
            });
        });

        it('should apply the styles to the element', () => {
            assert.equal(document.getElementById('SVRNE').getAttribute('style'), 'position: relative;');
        });
    });

    describe('when invoked with `styles` as a function', () => {
        beforeEach('setup DOM elements', () => {
            document.body.innerHTML = (`
                <div class="foo" id="SVRNE"></div>
            `);

            polymorph(document.getElementById('SVRNE'), () => ({
                'position': 'relative'
            }));
        });

        it('should apply the styles to the element', () => {
            assert.equal(document.getElementById('SVRNE').getAttribute('style'), 'position: relative;');
        });
    });

    describe('when invoked with `styles` parameter', () => {
        describe('when value is a function', () => {
            beforeEach('setup DOM elements', () => {
                document.body.innerHTML = (`
                    <div class="foo" id="SVRNE"></div>
                `);
    
                polymorph(document.getElementById('SVRNE'), () => ({
                    'position': () => 'relative'
                }));
            });
    
            it('should apply the styles to the element', () => {
                assert.equal(document.getElementById('SVRNE').getAttribute('style'), 'position: relative;');
            });
        });

        describe('when value is an array', () => {
            beforeEach('setup DOM elements', () => {
                document.body.innerHTML = (`
                    <div class="foo" id="SVRNE">
                        <div id="HH156"></div>
                    </div>
                `);
    
                polymorph(document.getElementById('SVRNE'), () => ({
                    'foo': [document.getElementById('HH156'), {
                        'color': 'red'
                    }]
                }));
            });
    
            it('should apply the styles to the element', () => {
                assert.equal(document.getElementById('HH156').getAttribute('style'), 'color: red;');
            });
        });

        describe('with styles for the root element', () => {
            beforeEach('setup DOM elements', () => {
                document.body.innerHTML = (`
                    <div class="foo" data-module="foo" id="SVRNE"></div>
                `);
    
                polymorph(document.getElementById('SVRNE'), {
                    'position': 'relative'
                });
            });

            it('should apply the styles to the element', () => {
                assert.equal(document.getElementById('SVRNE').getAttribute('style'), 'position: relative;');
            });
        });

        describe('with styles for a specified modifier', () => {
            beforeEach('setup DOM elements', () => {
                document.body.innerHTML = (`
                    <div class="foo" id="SVRNE"></div>
                    <div class="foo-bar" id="HH156"></div>
                `);
    
                polymorph(document.getElementById('SVRNE'), {
                    'modifier(bar)': {
                        'color': 'red'
                    }
                });
    
                polymorph(document.getElementById('HH156'), {
                    'modifier(bar)': {
                        'color': 'red'
                    }
                });
            });

            it('should apply the styles to elements with the specified modifier', () => {
                assert.equal(document.getElementById('SVRNE').getAttribute('style'), null);
                assert.equal(document.getElementById('HH156').getAttribute('style'), 'color: red;');
            });
        });

        describe('with styles for child components', () => {
            describe('when namespace is determined by data-attribute', () => {
                beforeEach('setup DOM elements', () => {
                    document.body.innerHTML = (`
                        <div class="foo" data-module="bar" id="SVRNE">
                            <div class="bar_fizz" id="HRJM1"></div>
                        </div>
                    `);
        
                    polymorph(document.getElementById('SVRNE'), {
                        fizz: {
                            'color': 'blue'
                        }
                    });
                });

                it('should apply the styles to the child components', () => {
                    assert.equal(document.getElementById('HRJM1').getAttribute('style'), 'color: blue;');
                });
            });

            describe('when value is an object', () => {
                beforeEach('setup DOM elements', () => {
                    document.body.innerHTML = (`
                        <div class="foo" id="SVRNE">
                            <div class="foo_bar" id="HH156"></div>
                            <div class="foo_bar" id="A0BG9"></div>
                            <div class="foo_fizz" id="HRJM1"></div>
                            <div class="foo_buzz" id="E0RZS"></div>
                        </div>
                    `);
        
                    polymorph(document.getElementById('SVRNE'), {
                        bar: {
                            'color': 'blue'
                        }
                    });

                    polymorph(document.getElementById('SVRNE'), {
                        fizz: {
                            'color': 'red'
                        }
                    });
                });

                it('should apply the styles to the child components', () => {
                    assert.equal(document.getElementById('HH156').getAttribute('style'), 'color: blue;');
                    assert.equal(document.getElementById('A0BG9').getAttribute('style'), 'color: blue;');
                    assert.equal(document.getElementById('HRJM1').getAttribute('style'), 'color: red;');
                    assert.equal(document.getElementById('E0RZS').getAttribute('style'), null);
                });
            });

            describe('when value is a function', () => {
                beforeEach('setup DOM elements', () => {
                    document.body.innerHTML = (`
                        <div class="foo" id="SVRNE">
                            <div class="foo_fizz" id="HRJM1"></div>
                        </div>
                    `);

                    polymorph(document.getElementById('SVRNE'), {
                        fizz: () => ({
                            'color': 'red'
                        })
                    });
                });

                it('should apply the styles to the child components', () => {
                    assert.equal(document.getElementById('HRJM1').getAttribute('style'), 'color: red;');
                });
            });
        });

        describe('with styles for a sub-component', () => {
            beforeEach('setup DOM elements', () => {
                document.body.innerHTML = (`
                    <div class="foo" id="SVRNE">
                        <div class="foo_alpha" id="HH156">
                            <div class="foo_alpha_beta" id="A0BG9">
                                <div class="foo_alpha_beta_gamma" id="HRJM1"></div>
                            </div>
                        </div>
                    </div>
                `);

                polymorph(document.getElementById('SVRNE'), {
                    'alpha': {
                        'beta': {
                            'color': 'blue'
                        }
                    }
                });
            });

            it('should apply the styles to the sub-component', () => {
                assert.equal(document.getElementById('A0BG9').getAttribute('style'), 'color: blue;');
            });
        });

        describe('with styles for a hovered element', () => {
            beforeEach('setup DOM elements', () => {
                document.body.innerHTML = (`
                    <div class="foo" id="SVRNE"></div>
                `);

                polymorph(document.getElementById('SVRNE'), {
                    ':hover': {
                        'color': 'red'
                    }
                });

                document.getElementById('SVRNE').dispatchEvent(new Event('mouseenter'));
            });

            it('should apply the styles to the element when hovered', () => {
                assert.equal(document.getElementById('SVRNE').getAttribute('style'), 'color: red;');
            });

            describe('after `mouseenter` event has already been triggered', () => {
                beforeEach('setup DOM elements', () => {
                    document.getElementById('SVRNE').dispatchEvent(new Event('mouseleave'));
                });

                it('should remove the styles from the element when hovered', () => {
                    assert.equal(document.getElementById('SVRNE').getAttribute('style'), '');
                });
            });
        });

        describe('with styles for Group/Wrapper parent element', () => {
            beforeEach('setup DOM elements', () => {
                document.body.innerHTML = (`
                    <div class="wrapper" id="SVRNE">
                        <div class="foo" id="HH156"></div>
                    </div>
                    <div class="group" id="A0BG9">
                        <div class="bar" id="HRJM1"></div>
                    </div>
                `);

                polymorph(document.getElementById('HH156'), {
                    'wrapper': {
                        'color': 'red'
                    }
                });

                polymorph(document.getElementById('HRJM1'), {
                    'wrapper': {
                        'color': 'blue'
                    }
                });
            });

            it('should add the styles to the parent Group element', () => {
                assert.equal(document.getElementById('SVRNE').getAttribute('style'), 'color: red;');
                assert.equal(document.getElementById('A0BG9').getAttribute('style'), 'color: blue;');
            });
        });
    });
});