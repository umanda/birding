import { parseAnswers, serializeAnswers } from './answers-params';

describe('parseAnswers', () => {
  it('defaults the month to today and leaves other questions unanswered', () => {
    expect(parseAnswers({}, 11)).toEqual({ month: 11 });
  });

  it('reads valid answers and ignores unknown values', () => {
    const answers = parseAnswers({ month: '3', zone: 'montane', habitat: 'swamp', size: 'XL' }, 11);
    expect(answers).toEqual({ month: 3, zone: 'montane', size: 'XL' });
  });

  it('treats "any" as no month and a bad month as today', () => {
    expect(parseAnswers({ month: 'any' }, 11).month).toBeUndefined();
    expect(parseAnswers({ month: '13' }, 11).month).toBe(11);
  });

  it('takes the first value of a repeated param', () => {
    expect(parseAnswers({ zone: ['coast', 'montane'] }, 1).zone).toBeUndefined();
    expect(parseAnswers({ zone: ['montane', 'coast'] }, 1).zone).toBe('montane');
  });
});

describe('colours and behaviour', () => {
  it('reads a comma-joined colours param in chosen order', () => {
    expect(parseAnswers({ colours: 'red,blue' }, 1).colours).toEqual(['red', 'blue']);
  });

  it('ignores unknown colours, drops repeats and keeps the first three', () => {
    expect(parseAnswers({ colours: 'red,teal,red,blue,pink,green' }, 1).colours).toEqual([
      'red',
      'blue',
      'pink',
    ]);
    expect(parseAnswers({ colours: 'teal' }, 1).colours).toBeUndefined();
  });

  it('takes the first value of a repeated colours param', () => {
    expect(parseAnswers({ colours: ['red', 'blue'] }, 1).colours).toEqual(['red']);
  });

  it('reads a behaviour and ignores an unknown one', () => {
    expect(parseAnswers({ behaviour: 'aerial' }, 1).behaviour).toBe('aerial');
    expect(parseAnswers({ behaviour: 'flying' }, 1).behaviour).toBeUndefined();
  });

  it('round-trips colours and behaviour', () => {
    const answers = { month: 2, colours: ['black', 'white'], behaviour: 'wading' } as const;
    const params = serializeAnswers({ ...answers, colours: [...answers.colours] });
    expect(params.colours).toBe('black,white');
    expect(parseAnswers(params, 1)).toEqual({ ...answers, colours: ['black', 'white'] });
  });
});

describe('serializeAnswers', () => {
  it('round-trips answers, including Any month', () => {
    const answers = { zone: 'dry_lowland', habitat: 'coast', size: 'S' } as const;
    expect(parseAnswers(serializeAnswers({ ...answers, month: 5 }), 1)).toEqual({
      ...answers,
      month: 5,
    });
    expect(serializeAnswers({})).toEqual({ month: 'any' });
  });
});
