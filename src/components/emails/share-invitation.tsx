import * as React from 'react';

interface ShareInvitationEmailProps {
    inviterName?: string;
    lessonTitle: string;
    lessonId: string;
}

export const ShareInvitationEmail: React.FC<ShareInvitationEmailProps> = ({
    inviterName = 'A user',
    lessonTitle,
    lessonId,
}) => (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
        <h1>You&apos;ve been invited to collaborate!</h1>
        <p>
            <strong>{inviterName}</strong> has invited you to edit the lesson plan:
        </p>
        <div style={{
            padding: '16px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #6366f1'
        }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>{lessonTitle}</h2>
        </div>
        <p>Click the button below to view and edit the lesson:</p>
        <a
            href={`https://planflow.app/p/${lessonId}`}
            style={{
                display: 'inline-block',
                backgroundColor: '#4f46e5',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                marginTop: '10px'
            }}
        >
            Open Lesson Plan
        </a>
        <p style={{ marginTop: '24px', fontSize: '12px', color: '#666' }}>
            If you did not expect this invitation, you can ignore this email.
        </p>
    </div>
);
