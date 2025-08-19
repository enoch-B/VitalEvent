import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Server } from 'lucide-react';

interface BackendStatus {
  isConnected: boolean;
  responseTime: number;
  lastChecked: Date;
  error?: string;
}

export function BackendStatus() {
  const [status, setStatus] = useState<BackendStatus>({
    isConnected: false,
    responseTime: 0,
    lastChecked: new Date(),
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      // Try to connect to the backend health endpoint
      // Using fetch with no-cors mode to bypass CORS issues
      const response = await fetch('http://localhost:5001/health', {
        method: 'GET',
        mode: 'no-cors', // This bypasses CORS for simple connectivity check
      });
      
      const endTime = Date.now();
      
      // If we get here, the server is reachable
      setStatus({
        isConnected: true,
        responseTime: endTime - startTime,
        lastChecked: new Date(),
      });
    } catch (error: any) {
      // Try alternative method - check if port is open
      try {
        const testResponse = await fetch('http://localhost:5001/', {
          method: 'GET',
          mode: 'no-cors',
        });
        const endTime = Date.now();
        
        setStatus({
          isConnected: true,
          responseTime: endTime - startTime,
          lastChecked: new Date(),
        });
      } catch (testError: any) {
        setStatus({
          isConnected: false,
          responseTime: 0,
          lastChecked: new Date(),
          error: 'Connection failed - server may not be running',
        });
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check status on component mount
    checkBackendStatus();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Backend Status
        </CardTitle>
        <CardDescription>
          Check connection to the backend server
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={status.isConnected ? "default" : "destructive"}>
            {status.isConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
        </div>

        {status.isConnected && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Response Time:</span>
            <span className="text-sm text-muted-foreground">
              {status.responseTime}ms
            </span>
          </div>
        )}

        {status.error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            Error: {status.error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Last Checked:</span>
          <span className="text-sm text-muted-foreground">
            {status.lastChecked.toLocaleTimeString()}
          </span>
        </div>

        <Button 
          onClick={checkBackendStatus} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Status'
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          Backend URL:  http://localhost:5001/api/v1
        </div>
      </CardContent>
    </Card>
  );
}
