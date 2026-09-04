import React, { useEffect, useState } from 'react'
import CountdownComponent from '../../components/countdown-component'
import { Button } from '../../components/ui/button'
import { ListRestart, Minus, Plus } from 'lucide-react'
import ReportFilter from './report-filter'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

const Reports = () => {

    const [formcount, setFormcount] = useState(1);

    const [formsRequest, setFormsRequest] = useState([]); 

    console.log(formsRequest);

    return (
        <div className='w-full grid gap-4 p-4'>
            <div className="w-full flex justify-end gap-2 my-2">
            {
                formcount > 1 &&
                <div className='flex items-center gap-2'>
                    <Button 
                      className="bg-destructive hover:bg-destructive/80"
                      onClick={() => setFormcount(1)}
                    >
                      <ListRestart />
                    </Button>
                    <Button 
                      className="bg-accent hover:bg-accent/80"
                      onClick={() => setFormcount(formcount-1)}
                    >
                      <Minus />
                    </Button>
                </div>
            }
                <Button 
                  className="bg-accent hover:bg-accent/80"
                  onClick={() => setFormcount(formcount+1)}
                >
                  <Plus />
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle></CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='w-full grid gap-6'>
                  {[...Array(formcount)].map((_, index) => (
                    <ReportFilter formIndex={index} formsRequest={formsRequest} setFormsRequest={setFormsRequest} />
                  ))}
                  </div>
                </CardContent>
            </Card>
            <div className='w-full flex items-center justify-end'>
              <Button 
                  className="bg-accent hover:bg-accent/80"
                >
                  Generate report
                </Button>
            </div>
        </div>
    );
}

export default Reports