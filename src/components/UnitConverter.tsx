import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Ruler, Weight, Beaker } from 'lucide-react';
import React from 'react';
// Simple map of unit descriptions
const unitDescriptions: Record<string, string> = {
  // Length
  meters: 'Meters are the base unit of length in the International System of Units (SI).',
  feet: 'Feet are a unit of length in the imperial and US customary systems.',
  inches: 'Inches are commonly used in the United States for small measurements.',
  yards: 'Yards are used in the imperial system, equal to 3 feet.',
  kilometers: 'Kilometers are used to measure long distances, especially in most countries outside the US.',
  centimeters: 'Centimeters are a metric unit of length, equal to one hundredth of a meter.',
  millimeters: 'Millimeters are a metric unit of length, equal to one thousandth of a meter.',
  // Fun units
  bananas: 'A banana is a fun, informal unit of length, roughly 16.7 cm.',
  pencil_lengths: 'A pencil length is about 17.5 cm, used for playful comparisons.',
  cat_whiskers: 'A cat whisker is about 5 cm, a whimsical unit of length.',
  gummy_bears: 'A gummy bear is about 2 cm long, used for fun measurements.',
  floppy_disks: 'A floppy disk (3.5") diagonal is about 9.4 cm.',
  wizard_wands: 'A wizard wand is about 35 cm, for magical measurements.',
  pirate_steps: 'A pirate step is about 75 cm, for adventurous distances.',
  marshmallow_puffs: 'A marshmallow puff is about 3 cm.',
  dragon_scales: 'A dragon scale is about 8 cm.',
  unicorn_horns: 'A unicorn horn is about 50 cm.',
  fairy_wings: 'A fairy wing is about 25 cm.',
  // Weight
  kilograms: 'Kilograms are the base unit of mass in the SI system.',
  pounds: 'Pounds are a unit of mass used in the imperial system.',
  ounces: 'Ounces are a small unit of mass in the imperial system.',
  grams: 'Grams are a metric unit of mass, equal to one thousandth of a kilogram.',
  stones: 'Stones are used in the UK to measure body weight, equal to 14 pounds.',
  tons: 'Tons are a large unit of mass, used for heavy objects.',
  // Volume
  liters: 'Liters are a metric unit of volume, commonly used for liquids.',
  gallons: 'Gallons are used in the US and UK for liquid measurements.',
  quarts: 'Quarts are a quarter of a gallon.',
  pints: 'Pints are used for measuring liquids, especially beer and milk.',
  cups: 'Cups are used in cooking to measure volume.',
  milliliters: 'Milliliters are a metric unit of volume, equal to one thousandth of a liter.',
  'fluid-ounces': 'Fluid ounces are used in the US and UK for small liquid measurements.'
};

// Simple map of unit images (all use placeholder for now)
const unitImages: Record<string, string> = {
   // Length
  meters: '/unit-images/meters.jpg',
  feet: '/unit-images/feet.jpg',
  inches: '/unit-images/inches.jpg',
  yards: '/unit-images/yards.jpg',
  kilometers: '/unit-images/kilometers.jpg',
  centimeters: '/unit-images/centimeters.jpg',
  millimeters: '/unit-images/millimeters.jpg',
  // Fun units
  bananas: '/unit-images/bananas.jpg',
  pencil_lengths: '/unit-images/pencil_lengths.jpg',
  cat_whiskers: '/unit-images/cat_whiskers.jpg',
  gummy_bears: '/unit-images/gummy_bears.jpg',
  floppy_disks: '/unit-images/floppy_disks.jpg',
  wizard_wands: '/unit-images/wizard_wands.jpg',
  pirate_steps: '/unit-images/pirate_steps.jpg',
  marshmallow_puffs: '/unit-images/marshmallow_puffs.jpg',
  dragon_scales: '/unit-images/dragon_scales.jpg',
  unicorn_horns: '/unit-images/unicorn_horns.jpg',
  fairy_wings: '/unit-images/fairy_wings.jpg',
  // Weight
  kilograms: '/unit-images/kilograms.jpg',
  pounds: '/unit-images/pounds.jpg',
  ounces: '/unit-images/ounces.jpg',
  grams: '/unit-images/grams.jpg',
  stones: '/unit-images/stones.jpg',
  tons: '/unit-images/tons.jpg',
  // Volume
  liters: '/unit-images/liters.jpg',
  gallons: '/unit-images/gallons.jpg',
  quarts: '/unit-images/quarts.jpg',
  pints: '/unit-images/pints.jpg',
  cups: '/unit-images/cups.jpg',
  milliliters: '/unit-images/milliliters.jpg',
  'fluid-ounces': '/unit-images/fluid-ounces.jpg'
};

// Types
type UnitData = {
  factor: number;
  symbol: string;
};

type ConversionData = {
  [key: string]: UnitData;
};

// Conversion data
const conversions: Record<string, ConversionData> = {
  length: {
      meters: { factor: 1, symbol: 'm' },
      feet: { factor: 3.28084, symbol: 'ft' },
      inches: { factor: 39.3701, symbol: 'in' },
      yards: { factor: 1.09361, symbol: 'yd' },
      kilometers: { factor: 0.001, symbol: 'km' },
      centimeters: { factor: 100, symbol: 'cm' },
      millimeters: { factor: 1000, symbol: 'mm' },
      bananas: { factor: 6, symbol: 'bn' }, // ~1/6 meter per banana (approx. 16.67 cm)
      pencil_lengths: { factor: 5.714, symbol: 'pn' }, // ~17.5 cm per pencil
      cat_whiskers: { factor: 20, symbol: 'cw' }, // ~5 cm per whisker
      gummy_bears: { factor: 50, symbol: 'gb' }, // ~2 cm per gummy bear
      floppy_disks: { factor: 10.638, symbol: 'fd' }, // ~9.4 cm per floppy disk (3.5" disk diagonal)
      wizard_wands: { factor: 2.857, symbol: 'ww' }, // ~35 cm per wand
      pirate_steps: { factor: 1.333, symbol: 'ps' }, // ~75 cm per step
      marshmallow_puffs: { factor: 33.333, symbol: 'mp' }, // ~3 cm per marshmallow
      dragon_scales: { factor: 12.5, symbol: 'ds' }, // ~8 cm per scale
      unicorn_horns: { factor: 2, symbol: 'uh' }, // ~50 cm per horn
      fairy_wings: { factor: 4, symbol: 'fw' } // ~25 cm per wing
  },
  weight: {
    kilograms: { factor: 1, symbol: 'kg' },
    pounds: { factor: 2.20462, symbol: 'lb' },
    ounces: { factor: 35.274, symbol: 'oz' },
    grams: { factor: 1000, symbol: 'g' },
    stones: { factor: 0.157473, symbol: 'st' },
    tons: { factor: 0.001, symbol: 't' }
  },
  volume: {
    liters: { factor: 1, symbol: 'L' },
    gallons: { factor: 0.264172, symbol: 'gal' },
    quarts: { factor: 1.05669, symbol: 'qt' },
    pints: { factor: 2.11338, symbol: 'pt' },
    cups: { factor: 4.22675, symbol: 'cup' },
    milliliters: { factor: 1000, symbol: 'mL' },
    'fluid-ounces': { factor: 33.814, symbol: 'fl oz' }
  }
};

const measureTypes = {
  length: { icon: Ruler, label: 'Length', units: Object.keys(conversions.length) },
  weight: { icon: Weight, label: 'Weight', units: Object.keys(conversions.weight) },
  volume: { icon: Beaker, label: 'Volume', units: Object.keys(conversions.volume) }
};

export default function UnitConverter() {
  const [activeTab, setActiveTab] = useState<keyof typeof conversions>('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  // Reset units when tab changes
  useEffect(() => {
    const units = measureTypes[activeTab].units;
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setFromValue('');
    setToValue('');
  }, [activeTab]);

  // Update conversion when fromUnit changes
  useEffect(() => {
    if (fromValue && !isNaN(Number(fromValue))) {
      setToValue(convertValue(fromValue, fromUnit, toUnit, activeTab));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromUnit]);

  // Update conversion when toUnit changes
  useEffect(() => {
    if (fromValue && !isNaN(Number(fromValue))) {
      setToValue(convertValue(fromValue, fromUnit, toUnit, activeTab));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toUnit]);

  // Convert values
  const convertValue = (value: string, from: string, to: string, type: string) => {
    if (!value || isNaN(Number(value))) return '';
    
    const num = parseFloat(value);
    const conversionData = conversions[type];
    
    // Convert to base unit first, then to target unit
    const baseValue = num / conversionData[from].factor;
    const result = baseValue * conversionData[to].factor;
    
    return result.toFixed(6).replace(/\.?0+$/, '');
  };

  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    setToValue(convertValue(value, fromUnit, toUnit, activeTab));
  };

  const handleToValueChange = (value: string) => {
    setToValue(value);
    setFromValue(convertValue(value, toUnit, fromUnit, activeTab));
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
          Better Units
        </h1>
        <p className="text-muted-foreground text-lg">
          Convert between different units of measurement with precision and hilarity
        </p>
      </div>

      {/* Measurement Type Card */}
      <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl text-foreground">
            Choose Measurement Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
      {/* Unit Info White Box */}
      <div className="bg-white rounded-xl shadow-lg border p-6 my-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* From Unit */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <img
            src={unitImages[fromUnit]}
            alt={fromUnit}
            className="w-40 h-40 object-contain mb-2 border rounded-lg bg-gray-50"
            loading="lazy"
          />
          <div className="font-semibold text-lg capitalize mb-1">{fromUnit.replace('-', ' ')}</div>
          <div className="text-sm text-muted-foreground text-center">
            {unitDescriptions[fromUnit] || 'No description available.'}
          </div>
        </div>
        {/* To Unit */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <img
            src={unitImages[toUnit]}
            alt={toUnit}
            className="w-40 h-40 object-contain mb-2 border rounded-lg bg-gray-50"
            loading="lazy"
          />
          <div className="font-semibold text-lg capitalize mb-1">{toUnit.replace('-', ' ')}</div>
          <div className="text-sm text-muted-foreground text-center">
            {unitDescriptions[toUnit] || 'No description available.'}
          </div>
        </div>
      </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as keyof typeof conversions)}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {Object.entries(measureTypes).map(([key, { icon: Icon, label }]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(measureTypes).map(([key, { units }]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-end md:items-stretch w-full">
                  {/* From Input */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">From</label>
                      <Badge variant="outline" className="text-xs">
                        {conversions[activeTab][fromUnit]?.symbol}
                      </Badge>
                    </div>
                    <Input
                      type="number"
                      placeholder="Enter value"
                      value={fromValue}
                      onChange={(e) => handleFromValueChange(e.target.value)}
                      className="text-lg h-12 border-2 focus:border-primary/50 transition-smooth"
                    />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            <div className="flex items-center justify-between w-full">
                              <span className="capitalize">{unit.replace('-', ' ')}</span>
                               <span className="text-muted-foreground ml-2">
                                 ({conversions[activeTab][unit]?.symbol})
                               </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Swap Button */}
                  <div className="flex flex-col justify-end md:justify-center items-center md:items-center pb-2 md:pb-0">
                    <button
                      onClick={swapUnits}
                      className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-smooth border-2 border-primary/20 hover:border-primary/30 group"
                      title="Swap units"
                    >
                      <ArrowLeftRight className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* To Input */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">To</label>
                      <Badge variant="outline" className="text-xs">
                        {conversions[activeTab][toUnit]?.symbol}
                      </Badge>
                    </div>
                    <Input
                      type="number"
                      placeholder="Result"
                      value={toValue}
                      onChange={(e) => handleToValueChange(e.target.value)}
                      className="text-lg h-12 border-2 focus:border-primary/50 transition-smooth"
                    />
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            <div className="flex items-center justify-between w-full">
                              <span className="capitalize">{unit.replace('-', ' ')}</span>
                               <span className="text-muted-foreground ml-2">
                                 ({conversions[activeTab][unit]?.symbol})
                               </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {fromValue && toValue && (
                  <div className="mt-6 p-4 bg-gradient-subtle rounded-lg border">
                    <p className="text-center text-foreground">
                      <span className="font-semibold">{fromValue} {fromUnit}</span>
                      <span className="mx-2 text-muted-foreground">=</span>
                      <span className="font-semibold">{toValue} {toUnit}</span>
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}