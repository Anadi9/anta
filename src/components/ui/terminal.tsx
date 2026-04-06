import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Terminal = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const terminalSteps = [
    { command: 'npm run validate-mvp', type: 'command' },
    { text: '🚀 Spinning up product build pipeline...', type: 'info', delay: 1000 },
    { text: '📝 Mapping assumptions & validation metrics...', type: 'info', delay: 2000 },
    { text: '🎨 Wiring AI-assisted UX flows...', type: 'info', delay: 3000 },
    { text: '💡 Optimizing for revenue signals...', type: 'info', delay: 4000 },
    { text: '✨ Compiling scalable architecture...', type: 'info', delay: 5000 },
    { text: '🎉 MVP bundle ready for launch!', type: 'success', delay: 6000 },
    { text: '🌐 Ready to learn from real users.', type: 'success', delay: 7000 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < terminalSteps.length) {
        const step = terminalSteps[currentStep];
        
        if (step.type === 'command') {
          setDisplayedText('');
          setIsTyping(true);
          let charIndex = 0;
          const typeInterval = setInterval(() => {
            if (charIndex < (step.command?.length || 0)) {
                setDisplayedText(step.command?.substring(0, charIndex + 1) || '');
                charIndex++;
            } else {
              clearInterval(typeInterval);
              setIsTyping(false);
              setTimeout(() => setCurrentStep(prev => prev + 1), 1500);
            }
          }, 80);
        } else {
          setDisplayedText(step.text || '');
          setTimeout(() => setCurrentStep(prev => prev + 1), step.delay);
        }
      } else {
        // Reset animation after completion
        setTimeout(() => {
          setCurrentStep(0);
          setDisplayedText('');
          setIsTyping(false);
        }, 2000);
      }
    }, currentStep === 0 ? 1000 : 0);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <StyledWrapper>
      <div className="card">
        <div className="wrap">
          <div className="terminal">
            <hgroup className="head">
              <p className="title">
                <svg width="16px" height="16px" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none">
                  <path d="M7 15L10 12L7 9M13 15H17M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" />
                </svg>
                MVP Studio
              </p>
              <button className="copy_toggle" tabIndex={-1} type="button">
                <svg width="16px" height="16px" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none">
                  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                  <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                </svg>
              </button>
            </hgroup>
            <div className="body">
              <div className="terminal-content">
                {/* Always show the command line */}
                <div className="command-line">
                  <span className="prompt">$</span> 
                  <span className="command">
                    {currentStep === 0 ? displayedText : terminalSteps[0].command}
                    {isTyping && <span className="cursor">|</span>}
                  </span>
                </div>
                
                {/* Show all completed outputs */}
                {terminalSteps.slice(1, currentStep).map((step, index) => (
                  <div key={index} className={`output-line ${step.type}`}>
                    <span className="checkmark">
                      {step.type === 'success' ? '🎉' : '✓'}
                    </span>
                    {step.text}
                  </div>
                ))}

                {/* Show current output if typing */}
                {currentStep > 0 && currentStep < terminalSteps.length && displayedText && (
                  <div className={`output-line ${terminalSteps[currentStep - 1]?.type || 'info'}`}>
                    <span className="checkmark">
                      {terminalSteps[currentStep - 1]?.type === 'success' ? '🎉' : '✓'}
                    </span>
                    {displayedText}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    overflow: hidden;
    border-radius: 12px;
    backdrop-filter: blur(8px);
    min-width: 344px;
  }
  .wrap {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    z-index: 10;
    border: 0.5px solid #525252;
    border-radius: 8px;
    overflow: hidden;
  }
  .terminal {
    display: flex;
    flex-direction: column;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    min-height: 40px;
    padding-inline: 12px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #202425;
  }
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 2.5rem;
    user-select: none;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #8e8e8e;
  }
  .title > svg {
    height: 18px;
    width: 18px;
    margin-top: 2px;
    color: #006adc;
  }
  .copy_toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border: 1px solid #404040;
    margin-left: auto;
    border-radius: 8px;
    background-color: #2a2a2a;
    color: #8e8e8e;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 32px;
    min-height: 32px;
  }
  .copy_toggle:hover {
    background-color: #404040;
    border-color: #606060;
    color: #ffffff;
  }
  .copy_toggle > svg {
    width: 16px;
    height: 16px;
  }
  .copy_toggle:active > svg > path,
  .copy_toggle:focus-within > svg > path {
    animation: clipboard-check 500ms linear forwards;
  }
  .body {
    display: flex;
    flex-direction: column;
    position: relative;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    overflow-x: auto;
    padding: 1rem;
    line-height: 19px;
    color: white;
    background-color: black;
    white-space: nowrap;
    min-height: 250px;
  }
  .terminal-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .command-line {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0;
    animation: fadeInUp 0.5s ease-out forwards;
  }
  .prompt {
    color: #e34ba9;
    font-weight: bold;
  }
  .command {
    color: #ffffff;
  }
  .cursor {
    animation: blink 1s infinite;
    color: #e34ba9;
  }
  .output-line {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0;
    animation: fadeInUp 0.5s ease-out forwards;
    color: #ffffff;
  }
  .output-line.info {
    color: #60a5fa;
  }
  .output-line.success {
    color: #22c55e;
  }
  .checkmark {
    color: #22c55e;
    font-weight: bold;
  }
  .pre {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-wrap: nowrap;
    white-space: pre;
    background-color: transparent;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 16px;
  }
  .pre code:nth-child(1) {
    color: #575757;
  }
  .pre code:nth-child(2) {
    color: #e34ba9;
  }
  .cmd {
    height: 19px;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: row;
  }
  .cmd::before {
    content: attr(data-cmd);
    position: relative;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    background-color: transparent;
    animation: inputs 8s steps(22) infinite;
  }
  .cmd::after {
    content: "";
    position: relative;
    display: block;
    height: 100%;
    overflow: hidden;
    background-color: transparent;
    border-right: 0.15em solid #e34ba9;
    animation: cursor 0.5s step-end infinite alternate, blinking 0.5s infinite;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  @keyframes blinking {
    20%, 80% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(0);
    }
  }
  @keyframes cursor {
    50% {
      border-right-color: transparent;
    }
  }
  @keyframes inputs {
    0%, 100% {
      width: 0;
    }
    10%, 90% {
      width: 58px;
    }
    30%, 70% {
      width: 215px;
      max-width: max-content;
    }
  }
  @keyframes clipboard-check {
    100% {
      color: #fff;
      d: path(
        "M 9 5 H 7 a 2 2 0 0 0 -2 2 v 12 a 2 2 0 0 0 2 2 h 10 a 2 2 0 0 0 2 -2 V 7 a 2 2 0 0 0 -2 -2 h -2 M 9 5 a 2 2 0 0 0 2 2 h 2 a 2 2 0 0 0 2 -2 M 9 5 a 2 2 0 0 1 2 -2 h 2 a 2 2 0 0 1 2 2 m -6 9 l 2 2 l 4 -4"
      );
    }
  }
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default Terminal;