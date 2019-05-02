import assert from 'assert';
import jsdom from 'jsdom-global';
import sQuery from '@onenexus/squery';
import polymorph from '../dist/polymorph';

jsdom();

global.sQuery = sQuery;

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
    
            it.skip('should apply the styles to the element', () => {
                assert.equal(document.getElementById('SVRNE').getAttribute('style'), 'position: relative;');
            });
        });

        describe('when value is an array', () => {
            beforeEach('setup DOM elements', () => {
                document.body.innerHTML = (`
                    <div class="foo" id="SVRNE">
                        <div class="bar" id="HH156"></div>
                        <div class="bar" id="HRJM1"></div>
                    </div>
                `);
    
                polymorph(document.getElementById('SVRNE'), () => ({
                    'fizz': [document.getElementById('HH156'), {
                        'color': 'red'
                    }],
                    'buzz': [document.querySelectorAll('.bar'), {
                        'height': '20px'
                    }]
                }));
            });
    
            it('should apply the styles to the element', () => {
                assert.equal(document.getElementById('HH156').getAttribute('style'), 'color: red; height: 20px;');
                assert.equal(document.getElementById('HRJM1').getAttribute('style'), 'height: 20px;');
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
                        'subComponent(beta)': {
                            'color': 'blue'
                        }
                    }
                });

                polymorph(document.getElementById('SVRNE'), {
                    'alpha': {
                        'subComponent(beta)': () => ({
                            'height': '16px'
                        })
                    }
                });
            });

            it('should apply the styles to the sub-component', () => {
                assert.equal(document.getElementById('A0BG9').getAttribute('style'), 'color: blue; height: 16px;');
            });
        });

        describe('with styles for a sub-component (smart)', () => {
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

                polymorph(document.getElementById('SVRNE'), {
                    'alpha': {
                        'beta': () => ({
                            'height': '16px'
                        })
                    }
                });
            });

            it('should apply the styles to the sub-component', () => {
                assert.equal(document.getElementById('A0BG9').getAttribute('style'), 'color: blue; height: 16px;');
            });
        });

        describe('with styles for a hovered element', () => {
            beforeEach('setup DOM elements', () => {
                document.body.innerHTML = (`
                    <div class="foo" id="SVRNE" data-module="foo">
                        <div class="foo_bar" id="E0RZS" data-component="bar">
                            <div class="foo_bar_qux" id="HRJM1" data-component="qux">
                                <div class="foo_bar" data-component="bar">
                                    <div class="foo_bar_qux" id="A0BG9" data-component="qux"></div>
                                </div>
                            </div>
                        </div>
                        <div class="foo_bar" id="HH156">
                            <div class="foo_bar_qux"></div>
                        </div>
                    </div>
                `);

                polymorph(document.getElementById('SVRNE'), {
                    bar: {
                        'color': 'black',
            
                        qux: {
                            'color': 'black',
                        },
            
                        ':hover': {
                            'color': 'red',
            
                            qux: {
                                // disableCascade: true,
                                'color': 'blue'
                            }
                        }
                    }
                });

                document.getElementById('E0RZS').dispatchEvent(new Event('mouseenter'));
                document.getElementById('HH156').dispatchEvent(new Event('mouseenter'));
            });

            it('should apply the styles to the element when hovered', () => {
                assert.equal(document.getElementById('E0RZS').getAttribute('style'), 'color: red;');
                assert.equal(document.getElementById('HRJM1').getAttribute('style'), 'color: blue;');
                // @TODO1
                // assert.equal(document.getElementById('A0BG9').getAttribute('style'), null);
            });

            describe('after `mouseenter` event has already been triggered', () => {
                beforeEach('setup DOM elements', () => {
                    document.getElementById('E0RZS').dispatchEvent(new Event('mouseleave'));
                });

                it('should remove the styles from the element when hovered', () => {
                    assert.equal(document.getElementById('E0RZS').getAttribute('style'), 'color: black;');
                    assert.equal(document.getElementById('HRJM1').getAttribute('style'), 'color: black;');
                });
            });
        });

        describe('with styles for a focused element', () => {
            beforeEach('setup DOM elements', () => {
                document.body.innerHTML = (`
                    <input type="text" class="foo" id="SVRNE" />
                `);

                polymorph(document.getElementById('SVRNE'), {
                    'color': 'black',

                    ':focus': {
                        'color': 'red'
                    }
                });

                document.getElementById('SVRNE').dispatchEvent(new Event('focus'));
            });

            it('should apply the styles to the element when focused', () => {
                assert.equal(document.getElementById('SVRNE').getAttribute('style'), 'color: red;');
            });

            describe('after `focus` event has already been triggered', () => {
                beforeEach('setup DOM elements', () => {
                    document.getElementById('SVRNE').dispatchEvent(new Event('blur'));
                });

                it('should remove the styles from the element when focused', () => {
                    assert.equal(document.getElementById('SVRNE').getAttribute('style'), 'color: black;');
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
                    'group': {
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

    describe('when `modifier` method is called', () => {
        beforeEach('setup DOM elements', () => {
            document.body.innerHTML = (`
                <div class="foo-bar" id="SVRNE">
                    <div class="foo_fizz-buzz" id="HH156"></div>
                </div>
            `);
        });

        it('should determine if element has passed modifier(s)', () => {
            assert(polymorph.modifier(document.getElementById('SVRNE'), 'bar'));
        });
    });
});